import type { FormInstance } from 'antd';

import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';

export function useFormRules() {
  const patternRules = {
    code: {
      message: '验证码格式不正确',
      pattern: REG_CODE_SIX,
      validateTrigger: 'onChange'
    },
    email: {
      message: '邮箱格式不正确',
      pattern: REG_EMAIL,
      validateTrigger: 'onChange'
    },
    phone: {
      message: '手机号格式不正确',
      pattern: REG_PHONE,
      validateTrigger: 'onChange'
    },
    pwd: {
      message: '密码格式不正确，6-18位字符，包含字母、数字、下划线',
      pattern: REG_PWD,
      validateTrigger: 'onChange'
    },
    userName: {
      message: '用户名格式不正确',
      pattern: REG_USER_NAME,
      validateTrigger: 'onChange'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    code: [createRequiredRule('请输入验证码'), patternRules.code],
    email: [createRequiredRule('请输入邮箱'), patternRules.email],
    phone: [createRequiredRule('请输入手机号'), patternRules.phone],
    pwd: [createRequiredRule('请输入密码'), patternRules.pwd],
    userName: [createRequiredRule('请输入用户名'), patternRules.userName]
  } satisfies Record<string, App.Global.FormRule[]>;

  const defaultRequiredRule = createRequiredRule('不能为空');

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      message,
      required: true
    };
  }

  function createConfirmPwdRule(from: FormInstance) {
    const confirmPwdRule: App.Global.FormRule[] = [
      { message: '请再次输入密码', required: true },
      {
        message: '两次输入密码不一致',
        validateTrigger: 'onChange',
        validator: (rule, value) => {
          const pwd = from.getFieldValue('password');

          if (value.trim() !== '' && value !== pwd) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        }
      }
    ];
    return confirmPwdRule;
  }

  return {
    createConfirmPwdRule,
    createRequiredRule,
    defaultRequiredRule,
    formRules,
    patternRules
  };
}
