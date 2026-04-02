interface CaptchaFieldProps {
  captchaLoading: boolean;
  captchaUrl: string;
  onRefresh: () => void;
}

const CaptchaField = ({ captchaLoading, captchaUrl, onRefresh }: CaptchaFieldProps) => (
  <AForm.Item
    name="captcha"
    rules={[{ message: '请输入验证码', required: true }]}
  >
    <ASpace>
      <AInput
        placeholder="验证码"
        size="large"
      />
      <ASpin spinning={captchaLoading}>
        <img
          alt="验证码"
          className="h-40px w-120px cursor-pointer rounded-8px"
          src={captchaUrl}
          onClick={onRefresh}
        />
      </ASpin>
    </ASpace>
  </AForm.Item>
)

export default CaptchaField
