export interface IHeaderColumn {
  field: string;
  header: string;
  width: string;
  isPin?: boolean;
  isResize?: boolean;
  class?: string;
  position?: number;
}

export interface IDropdown {
  label: string,
  value: number | string,
  severity?: string,
  rawData?: any,
};

export interface IActionTable {
  data: any;
  label: string;
  icon: string;
  command: Function,
};

export interface IConstant {
  id: number | string,
  value: string,
};

export interface ISelectButton {
  name: string,
  value: number | string,
};