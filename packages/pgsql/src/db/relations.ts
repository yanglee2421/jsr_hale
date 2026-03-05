import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => {
  return {
    // 用户、会话、订单、反馈的关系
    userTable: {
      sessions: r.many.sessionTable({
        from: r.userTable.id,
        to: r.sessionTable.user_id,
      }),
      orders: r.many.orderTable({
        from: r.userTable.id,
        to: r.orderTable.user_id,
      }),
      paymentRecords: r.many.paymentRecordTable({
        from: r.userTable.id,
        to: r.paymentRecordTable.user_id,
      }),
      feedbacks: r.many.userFeedbackTable({
        from: r.userTable.id,
        to: r.userFeedbackTable.user_id,
      }),
    },
    sessionTable: {
      user: r.one.userTable({
        from: r.sessionTable.user_id,
        to: r.userTable.id,
      }),
    },

    // 柜子和插座的关系
    cabinetTable: {
      sockets: r.many.socketTable({
        from: r.cabinetTable.id,
        to: r.socketTable.cabinet_id,
      }),
    },
    socketTable: {
      cabinet: r.one.cabinetTable({
        from: r.socketTable.cabinet_id,
        to: r.cabinetTable.id,
      }),
      runningRecords: r.many.socketRunningRecordTable({
        from: r.socketTable.id,
        to: r.socketRunningRecordTable.socket_id,
      }),
    },
    socketRunningRecordTable: {
      socket: r.one.socketTable({
        from: r.socketRunningRecordTable.socket_id,
        to: r.socketTable.id,
      }),
      order: r.one.orderTable({
        from: r.socketRunningRecordTable.order_id,
        to: r.orderTable.id,
      }),
    },

    // 订单和支付记录的关系
    orderTable: {
      user: r.one.userTable({
        from: r.orderTable.user_id,
        to: r.userTable.id,
      }),
      cabinet: r.one.cabinetTable({
        from: r.orderTable.cabinet_id,
        to: r.cabinetTable.id,
      }),
      socket: r.one.socketTable({
        from: r.orderTable.socket_id,
        to: r.socketTable.id,
      }),
      paymentRecords: r.many.paymentRecordTable({
        from: r.orderTable.id,
        to: r.paymentRecordTable.order_id,
      }),
    },
    paymentRecordTable: {
      order: r.one.orderTable({
        from: r.paymentRecordTable.order_id,
        to: r.orderTable.id,
      }),
      user: r.one.userTable({
        from: r.paymentRecordTable.user_id,
        to: r.userTable.id,
      }),
    },

    // 设备维护和用户反馈的关系
    deviceMaintenanceTable: {},
    userFeedbackTable: {},
  };
});
