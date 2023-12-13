export class Notification {
  id: number;
  createDate: Date;
  notes: string;
  notificationType: PushNotificationType;
  prNumber: string;
  poNumber: string;
}

export class UserNotification {
  notificationId: number;
  notification: Notification;
  userId: number;
  isRead: boolean;
}

export enum PushNotificationType {
  PrCreated = 1,
  PrUpdated = 2,
  PrApproved = 3,
  PrDisApproved = 4,
  PoApproved = 5,
  PoDisApproved = 6,
  ExecApproved = 7,
  ExecDisApproved = 8,
  PoCreated = 9
}
