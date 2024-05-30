import styled from "styled-components";
import { Input, Select } from "antd";

export const StyledInput = styled(Input)<{ $yourProp?: boolean }>`
  background-color: ${({ $yourProp }) => ($yourProp ? "salmon" : "#1E90FF")};
  width: 500px;
  autoSize: false;
  height: 30px;
`;

// Drop down menu 
export const StyledSelect = styled(Select)`
  min-width: 100px;
  height: 30px;
`;

