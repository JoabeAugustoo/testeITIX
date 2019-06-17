export class Action {
  title: string;
  icon: (string | ((value) => string));
  isHidden?: (obj: any, index: number) => boolean;
  action?: (obj: any, index: number) => any;
  permission?: string | string[];
}
