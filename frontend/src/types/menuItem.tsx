export type MenuItem = {
  icon?: React.JSX.Element;
  label: string;
  route: string;
  children?: MenuItem[];
}