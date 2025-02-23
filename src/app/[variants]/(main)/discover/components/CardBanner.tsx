import { Avatar, DivProps } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

export const useStyles = createStyles(({ css, token }) => ({
  banner: css`
    position: relative;

    overflow: hidden;

    height: 264px;
    width: 100%;
    // margin-block-end: -56px;
    margin-block-end: -26px;

    background: ${token.colorFillSecondary};
  `,
  bannerImg: css`
    position: absolute;
    // filter: blur(40px) saturate(1.5);
    object-fit: cover;
    object-position: top;
    top: 0;
    left: 0;
    width: 100% !important; // 强制覆盖行内样式
    height: 100% !important;
  `,
}));

interface CardBannerProps extends DivProps {
  avatar?: string | ReactNode;
  loading?: boolean;
  mask?: boolean;
  maskColor?: string;
  size?: number;
}

const CardBanner = memo<CardBannerProps>(
  ({ avatar, className, size = 600, children, ...props }) => {
    const { styles, theme, cx } = useStyles();

    return (
      <Flexbox
        align={'center'}
        className={cx(styles.banner, className)}
        justify={'center'}
        style={avatar ? {} : { backgroundColor: theme.colorFillTertiary }}
        width={'100%'}
        {...props}
      >
        {avatar && (
          <Avatar
            alt={'banner'}
            avatar={avatar}
            className={styles.bannerImg}
            shape={'square'}
            size={size}
          />
        )}
        {children}
      </Flexbox>
    );
  },
);

export default CardBanner;
