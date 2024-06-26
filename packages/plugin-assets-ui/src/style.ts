import { colors, dimensions } from '@erxes/ui/src/styles';

import { Input } from '@erxes/ui/src/components/form/styles';
import { InputBar } from '@erxes/ui-settings/src/styles';
import { highlight } from '@erxes/ui/src/utils/animations';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

interface ContainerBoxType {
  $row?: boolean;
  $column?: boolean;
  gap?: number;
  $justifyCenter?: boolean;
  justifyEnd?: boolean;
  align?: string;
  $spaceBetween?: boolean;
  $spaceAround?: boolean;
  $horizontal?: boolean;
  $vertical?: boolean;
  marginX?: number;
  marginY?: number;
  rightBorder?: boolean;
  flexWrap?: boolean;
  placeContentEnd?: boolean;
}

export const ContainerBox = styledTS<ContainerBoxType>(styled.div)`
    display:flex;
    flex-wrap:${({ flexWrap }) => (flexWrap ? 'wrap' : '')};
    flex-direction:${({ $row }) => ($row ? 'row' : '')} ${({ $column }) =>
      $column ? 'column' : ''};
    gap: ${({ gap }) => (gap ? `${gap}px` : '')};
    place-items: ${({ align }) => (align ? `${align}` : '')};
    place-content:${({ placeContentEnd }) => (placeContentEnd ? 'end' : '')};
    padding: ${({ $horizontal, $vertical }) =>
      $horizontal && $vertical
        ? '10px'
        : `${$vertical ? '10px 20px' : '0px'} ${$horizontal ? '10px' : '0px'}`};
    justify-content: ${({ $spaceBetween }) =>
      $spaceBetween ? 'space-between' : ''};
    justify-content:${({ $spaceAround }) => ($spaceAround ? 'space-around' : '')};
    justify-content: ${({ justifyEnd }) => (justifyEnd ? 'end' : '')};
    justify-content: ${({ $justifyCenter }) =>
      $justifyCenter ? 'center  ' : ''};
    margin:${({ marginX, marginY }) =>
      `${marginX ? `${marginX}px` : '0px'} ${
        marginY ? `${marginY}px` : '0px'
      }`};
    border-right:${({ rightBorder }) =>
      rightBorder ? '1px solid ${colors.borderPrimary}' : ''};
`;

export const InfoDetail = styled.p`
  margin: 0;
  display: block;
  font-size: 12px;
  font-weight: normal;
  color: ${colors.colorCoreGray};
  word-break: break-all;
`;

export const AssetContent = styled.div`
  padding: 12px 22px;
  word-break: break-word;
  background: rgba(10, 30, 65, 0.05);
  margin-top: 10px;
  transition: background 0.3s ease;
  border-radius: 3px;
  min-height: 50px;
  p {
    color: ${colors.textPrimary};
    font-size: 13px;
  }
  img,
  table,
  * {
    max-width: 576px !important;
  }
  ul,
  ol {
    padding-left: 20px;
    margin: 0 0 10px;
  }
  &:hover {
    background: rgba(10, 30, 65, 0.08);
    cursor: pointer;
  }
`;

export const TriggerTabs = styled.div`
    padding: 2px;
    margin-bottom : 20px

    > span {
      flex: 1;
      flex-shrink: 0;
      text-align: center;
      font-weight: 500;
      padding: ${dimensions.unitSpacing - 4}px ${dimensions.coreSpacing}px
      border-radius: ${dimensions.unitSpacing - 5}px;

      &.active {
        background: ${colors.colorSecondary};
        color: ${colors.colorWhite};

        &:before {
          display: none;
        }
      }
    }
`;

export const TabContainer = styled.div`
  border: 1px solid ${colors.borderPrimary};
  margin-bottom: 20px;
  border-radius: 5px;
`;

export const TabContent = styled.div`
  margin: 0px 15px;
`;

export const MoreContainer = styled.div`
  position: relative;
`;

export const Badge = styled.span`
  height: 20px;
  width: 20px;
  background-color: ${colors.colorCoreGreen};
  border-radius: 15px;
  text-align: center;
  color: ${colors.colorWhite};
  position: absolute;
  right: 0;
`;

export const MovementItemContainer = styled.div`
  position: relative;
  ${Input} {
    text-align: left;
  }
`;
export const MovementTableWrapper = styled.div`
  table {
    border-collapse: separate;
    border-spacing: 0 6px;

    thead tr th {
      position: inherit;
    }

    tr td {
      background: ${colors.colorWhite};

      &:first-child {
        padding: 8px 12px;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }

    th:last-child,
    td:last-child {
      border-right: none;
      text-align: inherit;
    }

    tr td,
    tr th {
      padding: 8px 12px;
      border: none;
    }
  }

  tbody tr {
    margin-bottom: 5px;
    border-radius: 6px;
    box-shadow: 0 0 5px 0 rgba(221, 221, 221, 0.7);

    &.active {
      animation: ${highlight} 0.9s ease;
    }
  }
`;

export const FormWrapper = styled.div`
  display: flex;

  div {
    flex: 1;
  }

  button {
    flex-shrink: 0;
    margin-left: 10px;
    align-self: baseline;
  }
`;

export const RemoveRow = styled.div`
  color: ${colors.colorCoreRed};

  &:hover {
    cursor: pointer;
  }
`;
export const CustomRangeContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-end;
  > div {
    flex: 1;
    margin-right: 8px;
    input[type='text'] {
      border: none;
      width: 100%;
      height: 34px;
      padding: 5px 0;
      color: #444;
      border-bottom: 1px solid;
      border-color: #ddd;
      background: none;
      border-radius: 0;
      box-shadow: none;
      font-size: 13px;
    }
  }
`;

export const EndDateContainer = styled.div`
  .rdtPicker {
    left: -98px !important;
  }
`;

export const MovementItemInfoContainer = styled.div`
  max-width: 45%;
  flex: 2;
  border-right: 1px solid ${colors.borderPrimary};
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  margin-right: 20px;
  padding-right: 20px;
  margin-top: -16px;
  margin-bottom: -16px;
  padding-top: 16px;
`;

export const MovementItemConfigContainer = styledTS<{ flex?: string }>(
  styled.div,
)`
  flex: ${(props) => (props.flex ? props.flex : '1')};
  margin-right: 10px;

  &:last-of-type {
    margin-right: 0;
  }
`;

export const KbTopics = styled.div`
  width: 100%;
  margin-bottom: 10px;
  padding: 5px 10px;
  cursor: pointer;
  box-shadow: 0 0 5px 0 rgba(221, 221, 221, 0.7);
  border-radius: 5px;
`;

export const KbCategoriesContainer = styled.div`
  padding-left: 20px;
  margin-left: 20px;
  border-left: 1px solid ${colors.bgGray};
`;

export const KbCategories = styled.div`
  margin-bottom: 10px;
  padding: 5px 10px;
  cursor: pointer;
  box-shadow: 0 0 5px 0 rgba(221, 221, 221, 0.7);
  border-radius: 5px;
  &:before {
    content: '';
    width: 1.2rem;
    position: absolute;
    z-index: 1;
    padding-top: 10px;
    left: 6%;
    border-bottom: 1px solid #d1d1d1e0;
  }
`;

export const KbArticlesContainer = styled.div`
  padding-left: 19px;
  margin-left: 19px;
  border-left: 1px solid ${colors.bgGray};
`;

export const KbArticles = styled.div`
  padding: 5px 10px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 0 5px 0 rgba(221, 221, 221, 0.7);
  border-radius: 5px;
  &:before {
    content: '';
    width: 1.2rem;
    position: absolute;
    z-index: 1;
    padding-top: 10px;
    left: 10%;
    border-bottom: 1px solid #d1d1d1e0;
  }
`;

export const KbTreeViewItem = styled.div`
  padding: 5px 10px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 0 5px 0 rgba(221, 221, 221, 0.7);
  border-radius: 5px;
  &.active {
    animation: ${highlight} 0.9s ease;
    box-shadow: 0 0 5px 0 #63d2d6;
  }
`;

export const SelectAssignType = styled(InputBar)`
  max-width: 150px;
  margin-top: 30px;
`;

export const FilterContainer = styled.div`
  padding: 10px 20px 20px;
`;
