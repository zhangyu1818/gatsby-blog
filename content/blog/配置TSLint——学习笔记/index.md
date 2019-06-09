---
title: 配置TSLint——学习笔记
date: "2019-03-05"
description: ""
---

每次用ant的生态，总觉得很棒，因为自带了eslint，prettier和stylelint，就觉得很规范，所以我准备在即将开发的博客后台管理的服务端配置上tslint来规范自己的代码风格

首先记录下**依赖**项目

- [`eslint`](https://github.com/eslint/eslint)
- `eslint-plugin-import`
- [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)
- [`@typescript-eslint/eslint-plugin`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin)
- [`eslint-config-airbnb-base`](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) 基础版 *airbnb* 风格的规范，还有 *react* 版的

接着还有 **prettier**
**webstorm** 集成了 *prettier*，所以一直在用，真的很好用
自从学了前端，最经常按的键已经从`Ctrl + S`变成了`Ctrl + Shift + P` ,**prettier** 快捷键哈哈

- [`prettier`](https://github.com/prettier/prettier)
- [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)
- [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier)

再贴上`.eslintrc.json`
``` json
{
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "parserOptions": {
        "project": "./tsconfig.json",
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "prettier/prettier": "error"
    },
    "env": {
        "node": true
    },
    "extends": [
        "airbnb-base",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ]
}
```
确实不太熟悉，配置也是照着来的，完全不明白自定义什么诶😂
先记录这点儿，开发过程出了问题再边调试边记录~
