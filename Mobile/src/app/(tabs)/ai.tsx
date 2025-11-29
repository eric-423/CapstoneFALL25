import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { APP_COLOR } from "@/utils/constant";
import { useCurrentApp } from "@/context/app.context";

interface DecodedToken {
  id?: number;
  userId?: number;
  sub?: number;
}

const AIScreen = () => {
  const { appState } = useCurrentApp();
  const [userId, setUserId] = useState<number | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      setJwtToken(token);

      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        const id = decoded.id || decoded.userId || decoded.sub || null;
        setUserId(id);
      } else if (appState?.userInfo?.id) {
        setUserId(appState.userInfo.id);
        console.log("Dify - Loaded user data from appState:", {
          userId: appState.userInfo.id,
        });
      } else {
        console.warn("Dify - No user data found");
      }
    } catch (error) {
      console.error("Error loading user data for Dify:", error);
    }
  }, [appState]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);
  useEffect(() => {
    if (userId !== null && jwtToken !== null && !isReady) {
      setIsReady(true);
    }
  }, [userId, jwtToken, isReady]);

  const htmlContent = useMemo(() => {
    if (!userId || !jwtToken) {
      console.warn("Dify - Cannot create HTML: missing userId or jwtToken", {
        userId,
        hasToken: !!jwtToken,
      });
      return "";
    }

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
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #f5f5f5;
          }
          #dify-chatbot-bubble-button {
            display: none !important;
          }
          #dify-chatbot-bubble-window {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            max-width: 100% !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            z-index: 9999 !important;
            display: block !important;
          }
          #dify-chatbot-bubble-window iframe {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
          }
        </style>
        <script>
          function sendLogToRN(level, message) {
            try {
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'console',
                  level: level,
                  message: message
                }));
              }
            } catch (e) {
            }
          }
          var originalLog = console.log;
          var originalError = console.error;
          var originalWarn = console.warn;
          
          console.log = function() {
            originalLog.apply(console, arguments);
            sendLogToRN('log', Array.from(arguments).join(' '));
          };
          
          console.error = function() {
            originalError.apply(console, arguments);
            sendLogToRN('error', Array.from(arguments).join(' '));
          };
          
          console.warn = function() {
            originalWarn.apply(console, arguments);
            sendLogToRN('warn', Array.from(arguments).join(' '));
          };
          (function() {
            var inputs = ${inputsJson};
            
            console.log('Dify - Setting config in HEAD before script load');
            console.log('Dify - Inputs object:', JSON.stringify(inputs));
            console.log('Dify - external_user_id:', inputs.external_user_id || 'MISSING');
            console.log('Dify - jwt_token:', inputs.jwt_token ? 'EXISTS (' + inputs.jwt_token.substring(0, 20) + '...)' : 'MISSING');
            
            window.difyChatbotConfig = {
              token: 'zuJKSoxQFk62iEMg',
              inputs: inputs,
              systemVariables: {
                user_id: inputs.external_user_id, 
                external_user_id: inputs.external_user_id,
                jwt_token: inputs.jwt_token,
              },
              userVariables: {
                external_user_id: inputs.external_user_id,
                jwt_token: inputs.jwt_token,
              },
            };
            
            window.difyInputs = inputs;
            window.difyExternalUserId = inputs.external_user_id;
            window.difyJwtToken = inputs.jwt_token;
            if (!window.difyChatbotConfig.inputs || !window.difyChatbotConfig.inputs.external_user_id || !window.difyChatbotConfig.inputs.jwt_token) {
              console.error('Dify - ERROR: Config missing required fields!', JSON.stringify(window.difyChatbotConfig));
            } else {
              console.log('Dify - Config verified successfully in HEAD');
            }
          })();
        </script>
        <script
          src="https://udify.app/embed.min.js"
          id="zuJKSoxQFk62iEMg"
          defer>
        </script>
        <script>
          (function() {
            if (!window.difyChatbotConfig || 
                !window.difyChatbotConfig.inputs || 
                !window.difyChatbotConfig.inputs.external_user_id || 
                !window.difyChatbotConfig.inputs.jwt_token) {
              console.error('Dify - ERROR: Config not ready!', window.difyChatbotConfig);
            } else {
              try {
                Object.freeze(window.difyChatbotConfig.inputs);
                Object.freeze(window.difyChatbotConfig.systemVariables);
                Object.freeze(window.difyChatbotConfig.userVariables);
                console.log('Dify - Config frozen to prevent changes');
              } catch (e) {
                console.warn('Dify - Cannot freeze config:', e);
              }
            }
            var scriptElement = document.getElementById('zuJKSoxQFk62iEMg');
            if (scriptElement) {
              scriptElement.onload = function() {
                setTimeout(function() {
                  console.log('Dify - Final config check after script load:', JSON.stringify(window.difyChatbotConfig));
                  if (window.difyChatbot) {
                    console.log('Dify - Chatbot object exists:', typeof window.difyChatbot);
                  } else {
                    console.warn('Dify - Chatbot object not found');
                  }
                }, 1000);
              };
            }
          })();
        </script>
      </head>
      <body>
        <script>
          var originalInputs = ${inputsJson};
          var originalConfig = {
            token: 'zuJKSoxQFk62iEMg',
            inputs: originalInputs,
            systemVariables: {
              user_id: originalInputs.external_user_id,
              external_user_id: originalInputs.external_user_id,
              jwt_token: originalInputs.jwt_token,
            },
            userVariables: {
              external_user_id: originalInputs.external_user_id,
              jwt_token: originalInputs.jwt_token,
            },
          };
          function ensureConfig() {
            if (!window.difyChatbotConfig) {
              console.log('Dify - Config missing, restoring from original');
              window.difyChatbotConfig = JSON.parse(JSON.stringify(originalConfig));
            } else {
              if (!window.difyChatbotConfig.inputs || 
                  !window.difyChatbotConfig.inputs.external_user_id || 
                  !window.difyChatbotConfig.inputs.jwt_token) {
                window.difyChatbotConfig.inputs = originalConfig.inputs;
                window.difyChatbotConfig.token = originalConfig.token;
              }
              if (!window.difyChatbotConfig.systemVariables || 
                  !window.difyChatbotConfig.systemVariables.external_user_id) {
                window.difyChatbotConfig.systemVariables = originalConfig.systemVariables;
              }
              
              if (!window.difyChatbotConfig.userVariables || 
                  !window.difyChatbotConfig.userVariables.external_user_id) {
                window.difyChatbotConfig.userVariables = originalConfig.userVariables;
              }
            }
          }
          
          var configCheckInterval = setInterval(function() {
            ensureConfig();
          }, 500);
          setTimeout(function() {
            clearInterval(configCheckInterval);
            console.log('Dify - Stopped config monitoring');
          }, 10000);
          function forceUpdateDifyConfig() {
            window.difyChatbotConfig = JSON.parse(JSON.stringify(originalConfig));
            if (window.difyChatbot) {
              if (typeof window.difyChatbot.updateConfig === 'function') {
                console.log('Dify - Calling updateConfig API');
                window.difyChatbot.updateConfig(window.difyChatbotConfig);
              }
              if (typeof window.difyChatbot.init === 'function') {
                console.log('Dify - Calling init API');
                window.difyChatbot.init();
              }
              if (typeof window.difyChatbot.setConfig === 'function') {
                console.log('Dify - Calling setConfig API');
                window.difyChatbot.setConfig(window.difyChatbotConfig);
              }
            }
            var configEvent = new CustomEvent('difyConfigUpdate', {
              detail: window.difyChatbotConfig
            });
            window.dispatchEvent(configEvent);
            console.log('Dify - Dispatched config update event');
            var iframe = document.querySelector('iframe[src*="udify"]');
            if (iframe && iframe.contentWindow) {
              try {
                iframe.contentWindow.difyChatbotConfig = window.difyChatbotConfig;
                console.log('Dify - Set config in iframe');
                iframe.contentWindow.postMessage({
                  type: 'difyConfigUpdate',
                  config: window.difyChatbotConfig,
                  inputs: originalInputs
                }, '*');
              } catch (e) {
                iframe.contentWindow.postMessage({
                  type: 'difyConfigUpdate',
                  config: window.difyChatbotConfig,
                  inputs: originalInputs
                }, '*');
              }
            }
            window.difyInputs = originalInputs;
            window.difyExternalUserId = originalInputs.external_user_id;
            window.difyJwtToken = originalInputs.jwt_token;
            var iframe = document.querySelector('iframe[src*="udify"]');
            if (iframe) {
              try {
                var currentSrc = iframe.src;
                iframe.src = '';
                setTimeout(function() {
                  iframe.src = currentSrc;
                  console.log('Dify - Reloaded iframe to apply new config');
                }, 100);
              } catch (e) {
                console.warn('Dify - Cannot reload iframe:', e);
              }
            }
            setTimeout(function() {
              var chatbotContainer = document.getElementById('dify-chatbot-bubble-window');
              if (chatbotContainer && window.difyChatbot) {
                if (typeof window.difyChatbot.destroy === 'function') {
                  window.difyChatbot.destroy();
                  setTimeout(function() {
                    console.log('Dify - Chatbot destroyed, waiting for reinit');
                  }, 500);
                }
              }
            }, 2000);
          }
          function openChatbot() {
            setTimeout(function() {
              ensureConfig();
              forceUpdateDifyConfig();
              if (window.difyChatbotConfig) {
                console.log('Dify - Config after script load:', JSON.stringify(window.difyChatbotConfig));
                console.log('Dify - external_user_id after load:', window.difyChatbotConfig.inputs?.external_user_id || 'MISSING');
                console.log('Dify - jwt_token after load:', window.difyChatbotConfig.inputs?.jwt_token ? 'EXISTS' : 'MISSING');
              }
              
              var bubbleButton = document.getElementById('dify-chatbot-bubble-button');
              var bubbleWindow = document.getElementById('dify-chatbot-bubble-window');
              
              if (bubbleButton) {
                bubbleButton.style.display = 'none';
                bubbleButton.click();
              }
              
              if (bubbleWindow) {
                bubbleWindow.style.display = 'block';
              }
              
              if (window.difyChatbot && typeof window.difyChatbot.open === 'function') {
                window.difyChatbot.open();
              }
            }, 1500);
          }
          function waitForDifyScript() {
            var checkCount = 0;
            var maxChecks = 20; 
            
            var checkInterval = setInterval(function() {
              checkCount++;
              var scriptLoaded = document.getElementById('zuJKSoxQFk62iEMg') && 
                                 (window.difyChatbot || document.querySelector('iframe[src*="udify"]'));
              
              if (scriptLoaded || checkCount >= maxChecks) {
                clearInterval(checkInterval);
                setTimeout(function() {
                  forceUpdateDifyConfig();
                  ensureConfig();
                }, 500);
              }
            }, 500);
          }
          
          window.addEventListener('load', function() {
            ensureConfig();
            waitForDifyScript();
          });
          
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
              ensureConfig();
              waitForDifyScript();
              openChatbot();
            });
          } else {
            ensureConfig();
            waitForDifyScript();
            openChatbot();
          }
        </script>
      </body>
    </html>
  `;
  }, [userId, jwtToken]);
  const injectedJavaScriptBeforeContentLoaded = useMemo(() => {
    if (!userId || !jwtToken) {
      return "";
    }
    const inputs: Record<string, string> = {};
    if (userId) {
      inputs.external_user_id = userId.toString();
    }
    if (jwtToken) {
      inputs.jwt_token = jwtToken;
    }

    const inputsJson = JSON.stringify(inputs);

    return `
      (function() {
        try {
          console.log('Dify - injectedJavaScriptBeforeContentLoaded: Setting config EARLIEST');
          var inputs = ${inputsJson};
          console.log('Dify - Inputs:', JSON.stringify(inputs));
          
          window.difyChatbotConfig = {
            token: 'zuJKSoxQFk62iEMg',
            inputs: inputs,
            systemVariables: {},
            userVariables: {},
          };
        } catch (e) {
          console.error('Dify - Error in injectedJavaScriptBeforeContentLoaded:', e);
        }
      })();
      true;
    `;
  }, [userId, jwtToken]);
  const injectedJavaScript = useMemo(() => {
    if (!userId || !jwtToken) {
      return "";
    }

    const inputs: Record<string, string> = {
      external_user_id: userId.toString(),
      jwt_token: jwtToken,
    };

    const inputsJson = JSON.stringify(inputs);

    return `
      (function() {
        try {
          console.log('Dify - injectedJavaScript: Ensuring config is set after load');
          var inputs = ${inputsJson};
          
          var originalConfig = {
            token: 'zuJKSoxQFk62iEMg',
            inputs: inputs,
            systemVariables: {},
            userVariables: {},
          };
          
          function forceSetConfig() {
            window.difyChatbotConfig = JSON.parse(JSON.stringify(originalConfig));
            console.log('Dify - Config force set in injectedJavaScript:', JSON.stringify(window.difyChatbotConfig));
            console.log('Dify - external_user_id:', window.difyChatbotConfig.inputs?.external_user_id || 'MISSING');
            console.log('Dify - jwt_token:', window.difyChatbotConfig.inputs?.jwt_token ? 'EXISTS' : 'MISSING');
          }
          forceSetConfig();
          
          setTimeout(forceSetConfig, 100);
          setTimeout(forceSetConfig, 500);
          setTimeout(forceSetConfig, 1000);
          setTimeout(forceSetConfig, 2000);
          var checkCount = 0;
          var configMonitor = setInterval(function() {
            checkCount++;
            if (!window.difyChatbotConfig || 
                !window.difyChatbotConfig.inputs || 
                !window.difyChatbotConfig.inputs.external_user_id || 
                !window.difyChatbotConfig.inputs.jwt_token) {
              console.log('Dify - Config lost, restoring (check #' + checkCount + ')');
              forceSetConfig();
            }
            if (checkCount >= 10) {
              clearInterval(configMonitor);
              console.log('Dify - Stopped config monitoring in injectedJavaScript');
            }
          }, 500);
        } catch (e) {
          console.error('Dify - Error in injectedJavaScript:', e);
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
        source={{
          html: htmlContent,
          baseUrl: "https://udify.app",
        }}
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
        injectedJavaScriptBeforeContentLoaded={
          injectedJavaScriptBeforeContentLoaded
        }
        injectedJavaScript={injectedJavaScript}
        key={`dify-${userId}-${jwtToken ? "token" : "no-token"}`}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView HTTP error: ", nativeEvent);
        }}
        onLoadEnd={() => {
          console.log("WebView loaded");
          if (userId || jwtToken) {
            console.log("Dify - User data available:", {
              userId,
              hasToken: !!jwtToken,
            });
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
            } else {
              console.log("WebView message:", event.nativeEvent.data);
            }
          } catch (e) {
            console.log("WebView message:", event.nativeEvent.data);
          }
        }}
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
