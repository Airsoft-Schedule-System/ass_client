// 로그인 사용자의 인앱 알림 조회와 읽음 처리를 제공

import { supabase } from '../../supabase/client';
import type { Tables } from '../../supabase/database.types';
import { toNotificationError } from './notifications.error';

export type AppNotification = ReturnType<typeof toAppNotification>;

const NOTIFICATION_SELECT =
  'id,type,title,body,action_url,data,game_session_id,participation_id,is_read,created_at' as const;

type NotificationRow = Pick<
  Tables<'notifications'>,
  | 'id'
  | 'type'
  | 'title'
  | 'body'
  | 'action_url'
  | 'data'
  | 'game_session_id'
  | 'participation_id'
  | 'is_read'
  | 'created_at'
>;

// 알림 행의 URL·읽음 필드를 앱 표기로 변환
function toAppNotification(row: NotificationRow) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    actionUrl: row.action_url,
    data: row.data,
    gameSessionId: row.game_session_id,
    participationId: row.participation_id,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

// 본인 알림을 최신 생성순으로 조회
export async function listNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select(NOTIFICATION_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw toNotificationError(error, 'load');
  return data.map(toAppNotification);
}

// 본인의 읽지 않은 알림 수만 조회
export async function countUnreadNotifications(): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) throw toNotificationError(error, 'load');
  return count ?? 0;
}

// 선택한 본인 알림을 읽음으로 변경
export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw toNotificationError(error, 'update');
}

// RLS가 허용하는 본인의 모든 미읽음 알림을 읽음으로 변경
export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) throw toNotificationError(error, 'update');
}
