export type MenuItem = {
    name: string;
    route: string;
    icon: React.ReactNode; // Adding an icon to each menu item
    target?: "_blank" | "_self" | "_parent" | "_top" | undefined;
};