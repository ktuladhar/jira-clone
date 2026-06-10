import styled, { css } from 'styled-components';

import { color, font, mixin, zIndexValues } from 'shared/utils/styles';
import { InputDebounced, Button } from 'shared/components';

export const CalendarFilterContainer = styled.div`
  position: relative;
  margin-left: 6px;
`;

export const PANEL_WIDTH = 720;

export const CalendarPanel = styled.div`
  z-index: ${zIndexValues.modal + 1};
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${PANEL_WIDTH}px;
  padding: 16px;
  border-radius: 3px;
  background: #fff;
  ${mixin.boxShadowDropdown}
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
`;

export const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  width: 100%;
`;

export const SearchInput = styled(InputDebounced)`
  width: 180px;
`;

export const FilterSelect = styled.div`
  min-width: 120px;
`;

export const ToolbarSpacer = styled.div`
  flex: 1;
`;

export const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MonthLabel = styled.div`
  min-width: 110px;
  text-align: center;
  ${font.medium}
  ${font.size(14)}
`;

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: ${color.textMedium};
  ${mixin.clickable}

  &:hover {
    background: ${color.backgroundLight};
    color: ${color.textDarkest};
  }
`;

export const MonthYearSelect = styled.div`
  width: 130px;
`;

export const CalendarGridWrapper = styled.div`
  scroll-margin-top: 8px;
`;

export const CalendarGrid = styled.div`
  border: 1px solid ${color.borderLightest};
  border-radius: 3px;
  overflow: hidden;
`;

export const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: ${color.backgroundLightest};
  border-bottom: 1px solid ${color.borderLightest};
`;

export const WeekDay = styled.div`
  padding: 8px 0;
  text-align: center;
  color: ${color.textMedium};
  ${font.size(12)}
  ${font.bold}
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const DayCell = styled.button`
  min-height: 72px;
  padding: 8px;
  border: none;
  border-right: 1px solid ${color.borderLightest};
  border-bottom: 1px solid ${color.borderLightest};
  background: #fff;
  text-align: left;
  vertical-align: top;
  ${mixin.clickable}

  &:nth-child(7n) {
    border-right: none;
  }

  ${props =>
    props.isFiller &&
    css`
      background: ${color.backgroundLightest};
      cursor: default;
      pointer-events: none;
    `}

  ${props =>
    props.isSelected &&
    css`
      background: ${color.backgroundLightPrimary};
    `}

  ${props =>
    props.isToday &&
    css`
      box-shadow: inset 0 0 0 2px ${color.primary};
    `}

  &:hover:not(:disabled) {
    background: ${props =>
      props.isSelected ? color.backgroundLightPrimary : color.backgroundLight};
  }
`;

export const DayNumber = styled.div`
  margin-bottom: 6px;
  color: ${color.textDark};
  ${font.size(13)}
  ${props => props.isToday && font.bold}
`;

export const IssueDots = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;

export const IssueDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${color.primary};
`;

export const IssueCount = styled.div`
  color: ${color.textMedium};
  ${font.size(11)}
`;

export const PanelFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

export const UnscheduledButton = styled(Button)`
  padding-left: 0;
`;
