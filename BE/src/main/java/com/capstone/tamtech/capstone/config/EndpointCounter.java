package com.capstone.tamtech.capstone.config;

import org.springframework.aop.support.AopUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

@Component
public class EndpointCounter implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public int countEndpoints() {
        if (applicationContext == null) {
            return 0;
        }

        Set<String> uniqueEndpoints = new HashSet<>();

        applicationContext.getBeansWithAnnotation(RestController.class)
                .values()
                .forEach(controller -> {
                    Class<?> controllerClass = AopUtils.getTargetClass(controller);

                    String basePath = "";
                    if (controllerClass.isAnnotationPresent(RequestMapping.class)) {
                        RequestMapping classMapping = controllerClass.getAnnotation(RequestMapping.class);
                        String[] paths = classMapping.value();
                        if (paths.length > 0) {
                            basePath = paths[0];
                        }
                    }

                    for (Method method : controllerClass.getDeclaredMethods()) {
                        String endpointPath = getEndpointPath(method, basePath);
                        if (endpointPath != null) {
                            String httpMethod = getHttpMethod(method);
                            if (httpMethod != null) {
                                uniqueEndpoints.add(httpMethod + " " + endpointPath);
                            }
                        }
                    }
                });

        return uniqueEndpoints.size();
    }

    private String getEndpointPath(Method method, String basePath) {
        if (method.isAnnotationPresent(GetMapping.class)) {
            GetMapping mapping = method.getAnnotation(GetMapping.class);
            return basePath + getPathFromMapping(mapping.value());
        } else if (method.isAnnotationPresent(PostMapping.class)) {
            PostMapping mapping = method.getAnnotation(PostMapping.class);
            return basePath + getPathFromMapping(mapping.value());
        } else if (method.isAnnotationPresent(PutMapping.class)) {
            PutMapping mapping = method.getAnnotation(PutMapping.class);
            return basePath + getPathFromMapping(mapping.value());
        } else if (method.isAnnotationPresent(DeleteMapping.class)) {
            DeleteMapping mapping = method.getAnnotation(DeleteMapping.class);
            return basePath + getPathFromMapping(mapping.value());
        } else if (method.isAnnotationPresent(PatchMapping.class)) {
            PatchMapping mapping = method.getAnnotation(PatchMapping.class);
            return basePath + getPathFromMapping(mapping.value());
        } else if (method.isAnnotationPresent(RequestMapping.class)) {
            RequestMapping mapping = method.getAnnotation(RequestMapping.class);
            return basePath + getPathFromMapping(mapping.value());
        }
        return null;
    }

    private String getHttpMethod(Method method) {
        if (method.isAnnotationPresent(GetMapping.class)) {
            return "GET";
        } else if (method.isAnnotationPresent(PostMapping.class)) {
            return "POST";
        } else if (method.isAnnotationPresent(PutMapping.class)) {
            return "PUT";
        } else if (method.isAnnotationPresent(DeleteMapping.class)) {
            return "DELETE";
        } else if (method.isAnnotationPresent(PatchMapping.class)) {
            return "PATCH";
        } else if (method.isAnnotationPresent(RequestMapping.class)) {
            RequestMapping mapping = method.getAnnotation(RequestMapping.class);
            RequestMethod[] methods = mapping.method();
            if (methods.length > 0) {
                return methods[0].name();
            }
        }
        return null;
    }

    private String getPathFromMapping(String[] paths) {
        if (paths.length > 0 && !paths[0].isEmpty()) {
            return paths[0];
        }
        return "";
    }
}
