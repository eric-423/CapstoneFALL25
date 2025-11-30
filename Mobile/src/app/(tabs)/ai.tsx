import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { APP_COLOR } from "@/utils/constant";
import { useCurrentApp } from "@/context/app.context";
import { Camera } from "expo-camera";

interface DecodedToken {
  i?: number;
  userId?: number;
  sub?: number;
}

const AIScreen = () => {
  const { appState } = useCurrentApp();
  const [userId, setUserId] = useState<number | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const webViewRef = React.useRef<any>(null);

  const loadUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      setJwtToken(token);

      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        const id = decoded.i || decoded.userId || decoded.sub || null;
        setUserId(id);
      } else if (appState?.userInfo?.id) {
        setUserId(appState.userInfo.id);
      }
    } catch (error) {
      console.error("Error loading user data for Dify:", error);
    }
  }, [appState]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Request microphone permission
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        if (Platform.OS === "android") {
          const checkResult = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );
          if (!checkResult) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
              {
                title: "Quyền truy cập microphone",
                message:
                  "Ứng dụng cần quyền truy cập microphone để bạn có thể nói chuyện với trợ lý AI.",
                buttonNeutral: "Để sau",
                buttonNegative: "Từ chối",
                buttonPositive: "Cho phép",
              }
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        if (Platform.OS !== "web") {
          const currentStatus = await Camera.getMicrophonePermissionsAsync();
          if (currentStatus.status !== "granted") {
            await Camera.requestMicrophonePermissionsAsync();
          }
        }
      } catch (error) {
        console.error("Error requesting microphone permission:", error);
      }
    };

    if (isReady) {
      requestMicrophonePermission();
      setTimeout(requestMicrophonePermission, 2000);
    }
  }, [isReady]);

  useEffect(() => {
    if (userId !== null && jwtToken !== null && !isReady) {
      setIsReady(true);
    }
  }, [userId, jwtToken, isReady]);

  const htmlContent = useMemo(() => {
    if (!userId || !jwtToken) return "";

    const inputs: Record<string, string> = {
      external_user_id: userId.toString(),
      jwt_token: jwtToken,
    };
    const inputsJson = JSON.stringify(inputs);

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob: https: http:;">
        <script>
          // Microphone permission helper
          window.requestMicrophonePermission = function(retryCount = 0) {
            return new Promise((resolve, reject) => {
              if (!navigator.mediaDevices?.getUserMedia) {
                reject(new Error('getUserMedia not supported'));
                return;
              }
              
              const constraints = retryCount > 1 ? { audio: true } : {
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
              };
              
              navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => resolve(stream))
                .catch((error) => {
                  if (retryCount < 3) {
                    setTimeout(() => {
                      window.requestMicrophonePermission(retryCount + 1).then(resolve).catch(reject);
                    }, (retryCount + 1) * 1000);
                  } else {
                    reject(error);
                  }
                });
            });
          };
          
          // Pre-request microphone permission
          (function preRequestMicrophone() {
            if (navigator.mediaDevices?.getUserMedia) {
              setTimeout(() => {
                navigator.mediaDevices.getUserMedia({ audio: true })
                  .then((stream) => {
                    setTimeout(() => {
                      stream.getTracks().forEach(track => track.stop());
                    }, 5000);
                  })
                  .catch(() => {
                    // Retry once
                    setTimeout(() => {
                      navigator.mediaDevices.getUserMedia({ audio: true })
                        .then((stream) => {
                          setTimeout(() => {
                            stream.getTracks().forEach(track => track.stop());
                          }, 5000);
                        })
                        .catch(() => {});
                    }, 2000);
                  });
              }, 2000);
            }
          })();
          
          // Override getUserMedia in parent window
          if (navigator.mediaDevices?.getUserMedia) {
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getUserMedia = function(constraints) {
              return originalGetUserMedia({ audio: true })
                .catch(() => originalGetUserMedia(constraints))
                .catch(() => {
                  return new Promise((resolve, reject) => {
                    setTimeout(() => {
                      originalGetUserMedia({ audio: true }).then(resolve).catch(reject);
                    }, 1000);
                  });
                });
            };
          }
          
          // Inject into iframe when it loads
          function injectMicrophoneHelperIntoIframe() {
            const iframe = document.querySelector('iframe[src*="udify"]');
            if (!iframe?.contentWindow) return;
            
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
              if (iframeDoc) {
                const script = iframeDoc.createElement('script');
                script.textContent = \`
                  (function() {
                    if (navigator.mediaDevices?.getUserMedia) {
                      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                      let isRequesting = false;
                      
                      navigator.mediaDevices.getUserMedia = function(constraints) {
                        if (isRequesting) {
                          return new Promise((resolve, reject) => {
                            setTimeout(() => {
                              navigator.mediaDevices.getUserMedia(constraints).then(resolve).catch(reject);
                            }, 500);
                          });
                        }
                        
                        isRequesting = true;
                        let retryCount = 0;
                        const maxRetries = 5;
                        
                        function attemptGetUserMedia() {
                          const audioConstraints = retryCount > 2 ? { audio: true } : {
                            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
                          };
                          
                          return originalGetUserMedia(audioConstraints)
                            .then((stream) => {
                              isRequesting = false;
                              return stream;
                            })
                            .catch((error) => {
                              if ((error.name === 'NotAllowedError' || error.name === 'NotReadableError' || error.name === 'NotFoundError') && retryCount < maxRetries) {
                                retryCount++;
                                return new Promise((resolve, reject) => {
                                  setTimeout(() => {
                                    attemptGetUserMedia().then(resolve).catch(reject);
                                  }, retryCount * 500);
                                });
                              }
                              isRequesting = false;
                              throw error;
                            });
                        }
                        
                        return attemptGetUserMedia();
                      };
                    }
                  })();
                \`;
                iframeDoc.head.appendChild(script);
              }
            } catch (e) {
              iframe.contentWindow.postMessage({
                type: 'enableMicrophone',
                requestPermission: true
              }, '*');
            }
          }
          
          // Monitor for iframe creation
          const iframeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'IFRAME' && node.src?.includes('udify')) {
                  setTimeout(injectMicrophoneHelperIntoIframe, 500);
                  setTimeout(injectMicrophoneHelperIntoIframe, 1500);
                  setTimeout(injectMicrophoneHelperIntoIframe, 3000);
                }
              });
            });
          });
          
          iframeObserver.observe(document.body, { childList: true, subtree: true });
          setTimeout(injectMicrophoneHelperIntoIframe, 1000);
          setTimeout(injectMicrophoneHelperIntoIframe, 3000);
          setTimeout(injectMicrophoneHelperIntoIframe, 5000);
        </script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #f5f5f5; }
          #dify-chatbot-bubble-button { display: none !important; }
          #dify-chatbot-bubble-window {
            position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            width: 100% !important; height: 100vh !important; max-width: 100% !important; max-height: 100vh !important;
            border-radius: 0 !important; box-shadow: none !important; z-index: 9999 !important; display: block !important;
          }
          #dify-chatbot-bubble-window iframe { width: 100% !important; height: 100% !important; border: none !important; }
        </style>
        <script>
          function sendLogToRN(level, message) {
            try {
              if (window.ReactNativeWebView?.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'console', level, message }));
              }
            } catch (e) {}
          }
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          console.log = function() { originalLog.apply(console, arguments); sendLogToRN('log', Array.from(arguments).join(' ')); };
          console.error = function() { originalError.apply(console, arguments); sendLogToRN('error', Array.from(arguments).join(' ')); };
          console.warn = function() { originalWarn.apply(console, arguments); sendLogToRN('warn', Array.from(arguments).join(' ')); };
          
          (function() {
            const inputs = ${inputsJson};
            window.difyChatbotConfig = {
              token: 'zuJKSoxQFk62iEMg',
              inputs: inputs,
              systemVariables: { user_id: inputs.external_user_id, external_user_id: inputs.external_user_id, jwt_token: inputs.jwt_token },
              userVariables: { external_user_id: inputs.external_user_id, jwt_token: inputs.jwt_token },
            };
            window.difyInputs = inputs;
            window.difyExternalUserId = inputs.external_user_id;
            window.difyJwtToken = inputs.jwt_token;
          })();
        </script>
        <script src="https://udify.app/embed.min.js" id="zuJKSoxQFk62iEMg" defer></script>
        <script>
          (function() {
            const originalInputs = ${inputsJson};
            const originalConfig = {
              token: 'zuJKSoxQFk62iEMg',
              inputs: originalInputs,
              systemVariables: { user_id: originalInputs.external_user_id, external_user_id: originalInputs.external_user_id, jwt_token: originalInputs.jwt_token },
              userVariables: { external_user_id: originalInputs.external_user_id, jwt_token: originalInputs.jwt_token },
            };
            
            function ensureConfig() {
              if (!window.difyChatbotConfig) {
                window.difyChatbotConfig = JSON.parse(JSON.stringify(originalConfig));
              } else {
                if (!window.difyChatbotConfig.inputs?.external_user_id || !window.difyChatbotConfig.inputs?.jwt_token) {
                  window.difyChatbotConfig.inputs = originalConfig.inputs;
                  window.difyChatbotConfig.token = originalConfig.token;
                }
                if (!window.difyChatbotConfig.systemVariables?.external_user_id) {
                  window.difyChatbotConfig.systemVariables = originalConfig.systemVariables;
                }
                if (!window.difyChatbotConfig.userVariables?.external_user_id) {
                  window.difyChatbotConfig.userVariables = originalConfig.userVariables;
                }
              }
            }
            
            const configCheckInterval = setInterval(ensureConfig, 500);
            setTimeout(() => clearInterval(configCheckInterval), 10000);
            
            function openChatbot() {
              setTimeout(() => {
                ensureConfig();
                const bubbleButton = document.getElementById('dify-chatbot-bubble-button');
                const bubbleWindow = document.getElementById('dify-chatbot-bubble-window');
                if (bubbleButton) { bubbleButton.style.display = 'none'; bubbleButton.click(); }
                if (bubbleWindow) { bubbleWindow.style.display = 'block'; }
                if (window.difyChatbot?.open) { window.difyChatbot.open(); }
              }, 1500);
            }
            
            function waitForDifyScript() {
              let checkCount = 0;
              const checkInterval = setInterval(() => {
                checkCount++;
                const scriptLoaded = document.getElementById('zuJKSoxQFk62iEMg') && 
                                     (window.difyChatbot || document.querySelector('iframe[src*="udify"]'));
                if (scriptLoaded || checkCount >= 20) {
                  clearInterval(checkInterval);
                  setTimeout(() => {
                    ensureConfig();
                    const iframe = document.querySelector('iframe[src*="udify"]');
                    if (iframe?.contentWindow) {
                      try {
                        iframe.contentWindow.postMessage({ type: 'enableMicrophone', requestPermission: true }, '*');
                      } catch (e) {}
                    }
                  }, 500);
                }
              }, 500);
            }
            
            window.addEventListener('load', () => { ensureConfig(); waitForDifyScript(); });
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => { ensureConfig(); waitForDifyScript(); openChatbot(); });
            } else {
              ensureConfig();
              waitForDifyScript();
              openChatbot();
            }
          })();
        </script>
      </head>
      <body></body>
    </html>
  `;
  }, [userId, jwtToken]);

  const injectedJavaScriptBeforeContentLoaded = useMemo(() => {
    if (!userId || !jwtToken) return "";
    const inputs = { external_user_id: userId.toString(), jwt_token: jwtToken };
    return `
      (function() {
        try {
          window.difyChatbotConfig = {
            token: 'zuJKSoxQFk62iEMg',
            inputs: ${JSON.stringify(inputs)},
            systemVariables: {},
            userVariables: {},
          };
        } catch (e) {
          console.error('Error in injectedJavaScriptBeforeContentLoaded:', e);
        }
      })();
      true;
    `;
  }, [userId, jwtToken]);

  const injectedJavaScript = useMemo(() => {
    if (!userId || !jwtToken) return "";
    const inputs = { external_user_id: userId.toString(), jwt_token: jwtToken };
    const originalConfig = {
      token: "zuJKSoxQFk62iEMg",
      inputs: inputs,
      systemVariables: {},
      userVariables: {},
    };
    return `
      (function() {
        try {
          function forceSetConfig() {
            window.difyChatbotConfig = JSON.parse(JSON.stringify(${JSON.stringify(
              originalConfig
            )}));
          }
          forceSetConfig();
          setTimeout(forceSetConfig, 100);
          setTimeout(forceSetConfig, 500);
          setTimeout(forceSetConfig, 1000);
          setTimeout(forceSetConfig, 2000);
          let checkCount = 0;
          const configMonitor = setInterval(() => {
            checkCount++;
            if (!window.difyChatbotConfig?.inputs?.external_user_id || !window.difyChatbotConfig?.inputs?.jwt_token) {
              forceSetConfig();
            }
            if (checkCount >= 10) clearInterval(configMonitor);
          }, 500);
        } catch (e) {
          console.error('Error in injectedJavaScript:', e);
        }
      })();
      true;
    `;
  }, [userId, jwtToken]);

  if (!isReady || htmlContent === "") {
    return (
      <View style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: APP_COLOR.BROWN }}>
            Vui lòng đăng nhập để sử dụng tính năng...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent, baseUrl: "https://udify.app" }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="always"
        originWhitelist={["*"]}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures={false}
        allowsProtectedMedia={true}
        mediaCapturePermissionGrantType="grant"
        setSupportMultipleWindows={false}
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
        onPermissionRequest={(request: any) => {
          const permission = request.nativeEvent?.permission;
          const resources = request.nativeEvent?.resources;
          const requestObj = request.nativeEvent?.request;

          if (requestObj) {
            try {
              if (resources?.length > 0) {
                requestObj.grant(resources);
              } else if (permission) {
                requestObj.grant([permission]);
              } else {
                requestObj.grant();
              }
              try {
                if (requestObj.grant) {
                  requestObj.grant(["android.webkit.resource.AUDIO_CAPTURE"]);
                }
              } catch (e) {}
            } catch (error) {
              try {
                if (requestObj.grant) requestObj.grant();
              } catch (e) {}
            }
          }
        }}
        injectedJavaScriptBeforeContentLoaded={
          injectedJavaScriptBeforeContentLoaded
        }
        injectedJavaScript={injectedJavaScript}
        key={`dify-${userId}-${jwtToken ? "token" : "no-token"}`}
        onError={(syntheticEvent) => {
          console.warn("WebView error: ", syntheticEvent.nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          console.warn("WebView HTTP error: ", syntheticEvent.nativeEvent);
        }}
        onLoadEnd={() => {
          if (webViewRef.current) {
            setTimeout(() => {
              webViewRef.current?.injectJavaScript(`
                (function() {
                  if (navigator.mediaDevices?.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ audio: true })
                      .then((stream) => {
                        setTimeout(() => {
                          stream.getTracks().forEach(track => track.stop());
                        }, 3000);
                      })
                      .catch(() => {
                        setTimeout(() => {
                          navigator.mediaDevices.getUserMedia({ audio: true })
                            .then((stream) => {
                              setTimeout(() => {
                                stream.getTracks().forEach(track => track.stop());
                              }, 3000);
                            })
                            .catch(() => {});
                        }, 2000);
                      });
                  }
                  window.addEventListener('message', (event) => {
                    if (event.data?.type === 'requestMicrophonePermission' && window.requestMicrophonePermission) {
                      window.requestMicrophonePermission(0)
                        .then((stream) => {
                          const iframe = document.querySelector('iframe[src*="udify"]');
                          if (iframe?.contentWindow) {
                            iframe.contentWindow.postMessage({ type: 'microphonePermissionGranted', stream }, '*');
                          }
                        })
                        .catch((error) => {
                          const iframe = document.querySelector('iframe[src*="udify"]');
                          if (iframe?.contentWindow) {
                            iframe.contentWindow.postMessage({ type: 'microphonePermissionDenied', error: error.message }, '*');
                          }
                        });
                    }
                  });
                })();
                true;
              `);
            }, 1000);
            setTimeout(() => {
              webViewRef.current?.injectJavaScript(`
                (function() {
                  if (navigator.mediaDevices?.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ audio: true })
                      .then((stream) => {
                        setTimeout(() => {
                          stream.getTracks().forEach(track => track.stop());
                        }, 2000);
                      })
                      .catch(() => {});
                  }
                })();
                true;
              `);
            }, 5000);
          }
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "console") {
              const prefix = `[WebView ${data.level.toUpperCase()}]:`;
              if (data.level === "error") {
                console.error(prefix, data.message);
              } else if (data.level === "warn") {
                console.warn(prefix, data.message);
              } else {
                console.log(prefix, data.message);
              }
            } else if (
              data.type === "requestMicrophone" &&
              Platform.OS !== "web"
            ) {
              Camera.requestMicrophonePermissionsAsync()
                .then((result) => {
                  if (result.status === "granted" && webViewRef.current) {
                    webViewRef.current.injectJavaScript(`
                      if (window.requestMicrophonePermission) {
                        window.requestMicrophonePermission(0).catch(() => {});
                      }
                      true;
                    `);
                  }
                })
                .catch(() => {});
            }
          } catch (e) {
            // Not JSON, ignore
          }
        }}
        ref={webViewRef}
        onConsoleMessage={(event: any) => {
          const message = event.nativeEvent.message;
          const level = event.nativeEvent.level || "log";
          const prefix = `[WebView Console ${level.toUpperCase()}]:`;
          if (level === "error") {
            console.error(prefix, message);
          } else if (level === "warn") {
            console.warn(prefix, message);
          } else {
            console.log(prefix, message);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default AIScreen;
