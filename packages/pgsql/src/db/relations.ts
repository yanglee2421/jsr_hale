import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => {
  return {
    userTable: {
      orders: r.many.chargingOrderTable({
        from: r.userTable.id,
        to: r.chargingOrderTable.user_id,
      }),
      feedbacks: r.many.userFeedbackTable({
        from: r.userTable.id,
        to: r.userFeedbackTable.user_id,
      }),
    },
    chargingCabinetTable: {
      sockets: r.many.chargingSocketTable({
        from: r.chargingCabinetTable.id,
        to: r.chargingSocketTable.cabinet_id,
      }),
    },
    chargingSocketTable: {
      cabinet: r.one.chargingCabinetTable({
        from: r.chargingSocketTable.cabinet_id,
        to: r.chargingCabinetTable.id,
      }),
    },
  };
});
