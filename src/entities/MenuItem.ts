export default interface MenuItem {
  name?: string;
  route?: string;
  isHead?: boolean;
  menus?: MenuItem[];
}
