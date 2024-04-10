package com.example.toolmanagingsystem.aop.advisor.pointcut;

import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ExpressionPointcut
{
    @Bean
    public AspectJExpressionPointcut aspectJExpressionPointcut()
    {
        AspectJExpressionPointcut expressionPointcut = new AspectJExpressionPointcut();
        expressionPointcut.setExpression("execution(* com.example.toolmanagingsystem.configuration.DataSourceConfiguration.dataSource(..))");
        return expressionPointcut;
    }
}
