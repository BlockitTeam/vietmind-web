import React from "react";

type Therapist = {
  name: string;
  description: string;
};

const therapists: Therapist[] = [
  {
    name: "Vũ Văn Thuấn",
    description: "Ths tâm lý lâm sàng, Bệnh viện Nhi Trung Ương",
  },
  {
    name: "Hoàng Thị Thanh Huệ",
    description: "Ths sĩ tâm lý lâm sàng, Viện hàn lâm khoa học xã hội Việt Nam",
  },
  {
    name: "Hoàng Quốc Lân",
    description: "Ths sĩ tâm lý lâm sàng, Bệnh viện đa khoa Phương Đông",
  },
  {
    name: "Lê Ánh Nguyệt",
    description: "Ths sĩ tâm lý lâm sàng",
  },
  {
    name: "Lưu Ngọc Chinh",
    description: "Ths sĩ tâm lý lâm sàng, Trung tâm Hừng Đông",
  },
  {
    name: "Lưu Thị Phương Loan",
    description:
      "Ths sĩ tâm lý lâm sàng,\nTrung tâm Nghiên cứu và Ứng dụng Tâm lý - Giáo dục Chân Bảo",
  },
];

export const TherapistsTable: React.FC = () => (
  <div
    className="rounded-lg p-8"
    tabIndex={0}
    aria-label="Our Therapists Table"
  >
    <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Therapists</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-white text-white table-auto">
        <tbody>
          {therapists.map((therapist) => (
            <tr key={therapist.name} className="border-b border-white last:border-b-0">
              <td className="px-6 py-4 align-top font-medium">{therapist.name}</td>
              <td className="px-6 py-4 whitespace-pre-line">{therapist.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);