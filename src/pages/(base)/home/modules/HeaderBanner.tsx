import avatar from '@/assets/imgs/skyroc.jpg';
import { useUserInfo } from '@/service/hooks';

interface StatisticData {
  id: number;
  title: string;
  value: string;
}

const HeaderBanner = () => {
  const { data: userInfo } = useUserInfo();

  const statisticData: StatisticData[] = [
    { id: 0, title: '项目数', value: '25' },
    { id: 1, title: '待办', value: '4/16' },
    { id: 2, title: '消息', value: '12' }
  ];
  return (
    <ACard
      className="card-wrapper"
      variant="borderless"
    >
      <ARow gutter={[16, 16]}>
        <ACol
          md={18}
          span={24}
        >
          <div className="flex-y-center">
            <div className="size-72px shrink-0 overflow-hidden rd-1/2">
              <img
                className="size-full"
                src={avatar}
              />
            </div>
            <div className="pl-12px">
              <h3 className="text-18px font-semibold">早安，{userInfo?.userName}，今天又是充满活力的一天！</h3>
              <p className="text-#999 leading-30px">今日多云转晴，20℃ - 25℃！</p>
            </div>
          </div>
        </ACol>

        <ACol
          md={6}
          span={24}
        >
          <ASpace
            className="w-full justify-end"
            size={24}
          >
            {statisticData.map(item => (
              <AStatistic
                className="whitespace-nowrap"
                key={item.id}
                {...item}
              />
            ))}
          </ASpace>
        </ACol>
      </ARow>
    </ACard>
  );
};

export default HeaderBanner;
