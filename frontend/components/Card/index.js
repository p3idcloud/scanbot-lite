import { CardWrapper, CardContainer, DotStatusWrapper, DotParent, DotChild } from './style';
import PropTypes from 'prop-types';

const Card = ({
  children,
  background,
  style,
  hover,
  withpadding,
  disabledcard,
  status,
  noBorder,
  spaceTop,
  boxShadow,
  styleContainer,
  bgHover,
  onClick
}) => {
  const colorStatus =
    status === 'error'
      ? {
          colorParent: '#FFA0A0',
          colorChild: '#F70303'
        }
      : {
          colorParent: '#A3F7B3',
          colorChild: '#02841B'
        };
  return (
    <CardContainer sx={{ marginTop: spaceTop ? 3 : 0, ...styleContainer }} onClick={onClick}>
      <CardWrapper
        variant="outlined"
        sx={{ background: background, ...style }}
        hover={hover ? 'true' : null}
        noborder={noBorder ? 'true' : null}
        bghover={bgHover === true ? '#F8F8FA' : bgHover.toString()}
        shadow={boxShadow ? 'true' : null}
        withpadding={withpadding ? withpadding?.toString() : ''}
        disabledcard={disabledcard ? disabledcard?.toString() : ''}
      >
        {children}
      </CardWrapper>
      {status && (
        <DotStatusWrapper>
          <DotParent sx={{ background: colorStatus.colorParent }}>
            <DotChild
              sx={{
                background: colorStatus.colorChild
              }}
            />
          </DotParent>
        </DotStatusWrapper>
      )}
    </CardContainer>
  );
};

Card.propTypes = {
  withpadding: PropTypes.bool,
  spaceTop: PropTypes.bool,
  boxShadow: PropTypes.bool,
  hover: PropTypes.bool,
  disabledcard: PropTypes.bool,
  noBorder: PropTypes.bool,
  styleContainer: PropTypes.any,
  bgHover: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};
Card.defaultProps = {
  withpadding: false,
  bgHover: 'auto'
};

export default Card;
