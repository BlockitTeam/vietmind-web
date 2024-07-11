export const displayStatusAppointment = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Đang đợi xác nhận";

    case "CONFIRMED":
      return "Đã xác nhận";

    case "CANCELLED":
      return "Đã huỷ";

    default:
      break;
  }
};
