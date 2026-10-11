import { MemeStatus, NASAItemDetails } from '@/types/game';

// Server-only expert rankings & explanations. Never send to client before reveal.
export const NASA_EXPERT_ITEMS: NASAItemDetails[] = [
  {
    expertRank: 1,
    id: 'oxy',
    nameVi: 'Hai bình oxy',
    nameEn: 'Two tanks of oxygen',
    explanationVi: 'Nhu cầu sống còn quan trọng nhất.',
  },
  {
    expertRank: 2,
    id: 'nuoc',
    nameVi: 'Nước 15 lít',
    nameEn: 'Fifteen liters of water',
    explanationVi: 'Bù lượng nước mất đi khi di chuyển ở vùng được chiếu sáng.',
  },
  {
    expertRank: 3,
    id: 'ban_do_sao',
    nameVi: 'Bản đồ sao',
    nameEn: 'Stellar map',
    explanationVi: 'Định hướng trên Mặt Trăng.',
  },
  {
    expertRank: 4,
    id: 'thuc_pham',
    nameVi: 'Thực phẩm cô đặc',
    nameEn: 'Food concentrate',
    explanationVi: 'Cung cấp năng lượng hiệu quả.',
  },
  {
    expertRank: 5,
    id: 'bo_dam',
    nameVi: 'Bộ đàm FM dùng năng lượng mặt trời',
    nameEn: 'Solar-powered FM walkie-talkie',
    explanationVi: 'Liên lạc cứu hộ trong giới hạn tầm phát sóng.',
  },
  {
    expertRank: 6,
    id: 'day_nylon',
    nameVi: 'Dây nylon 18 m',
    nameEn: 'Eighteen meters of nylon rope',
    explanationVi: 'Vượt địa hình, hỗ trợ người bị thương.',
  },
  {
    expertRank: 7,
    id: 'so_cuu',
    nameVi: 'Bộ sơ cứu',
    nameEn: 'First-aid kit',
    explanationVi: 'Hỗ trợ y tế và chăm sóc sức khỏe.',
  },
  {
    expertRank: 8,
    id: 'vai_du',
    nameVi: 'Vải dù',
    nameEn: 'Parachute silk',
    explanationVi: 'Che chắn nắng.',
  },
  {
    expertRank: 9,
    id: 'xuong',
    nameVi: 'Xuồng cứu sinh tự bơm',
    nameEn: 'Self-inflating life raft',
    explanationVi: 'Trong lời giải lịch sử, bình CO₂ có thể hỗ trợ tạo lực đẩy.',
  },
  {
    expertRank: 10,
    id: 'phao_hieu',
    nameVi: 'Pháo hiệu',
    nameEn: 'Signal flares',
    explanationVi: 'Tạo tín hiệu báo nguy.',
  },
  {
    expertRank: 11,
    id: 'sung',
    nameVi: 'Hai khẩu súng lục cỡ .45',
    nameEn: 'Two .45 caliber pistols',
    explanationVi: 'Trong lời giải lịch sử, có thể tạo lực đẩy rất hạn chế.',
  },
  {
    expertRank: 12,
    id: 'sua_bot',
    nameVi: 'Một thùng sữa bột',
    nameEn: 'One case of powdered milk',
    explanationVi: 'Cồng kềnh và trùng chức năng thực phẩm cô đặc.',
  },
  {
    expertRank: 13,
    id: 'suoi',
    nameVi: 'Thiết bị sưởi năng lượng mặt trời',
    nameEn: 'Solar-powered heating unit',
    explanationVi: 'Không cần trên vùng Mặt Trăng được chiếu sáng.',
  },
  {
    expertRank: 14,
    id: 'la_ban',
    nameVi: 'La bàn từ',
    nameEn: 'Magnetic compass',
    explanationVi: 'Không hỗ trợ định hướng như trên Trái Đất.',
  },
  {
    expertRank: 15,
    id: 'diem',
    nameVi: 'Hộp diêm',
    nameEn: 'Box of matches',
    explanationVi: 'Không có oxy môi trường để duy trì ngọn lửa.',
  },
];

const EXPERT_RANK_MAP = new Map<string, number>(
  NASA_EXPERT_ITEMS.map((item) => [item.id, item.expertRank])
);

/**
 * Calculates Error Score (E) and Survival Score from ordered item IDs.
 * Input must be an array of exactly 15 unique item IDs.
 */
export function calculateScore(orderedItemIds: string[]): {
  errorScore: number;
  survivalScore: number;
  status: MemeStatus;
  variantId: number;
} {
  if (!Array.isArray(orderedItemIds) || orderedItemIds.length !== 15) {
    throw new Error('Danh sách vật phẩm phải đủ 15 món.');
  }

  const uniqueIds = new Set(orderedItemIds);
  if (uniqueIds.size !== 15) {
    throw new Error('Danh sách vật phẩm bị lặp lại hoặc thiếu.');
  }

  let errorScore = 0;
  orderedItemIds.forEach((itemId, index) => {
    const playerRank = index + 1; // 1 to 15
    const expertRank = EXPERT_RANK_MAP.get(itemId);
    if (expertRank === undefined) {
      throw new Error(`Vật phẩm không hợp lệ: ${itemId}`);
    }
    errorScore += Math.abs(playerRank - expertRank);
  });

  // Range E: 0..112
  // Formula: SURVIVAL_SCORE = Math.round(100 * (112 - E) / 112)
  const survivalScore = Math.round((100 * (112 - errorScore)) / 112);

  let status: MemeStatus;
  if (survivalScore >= 70) {
    status = 'SỐNG';
  } else if (survivalScore >= 40) {
    status = 'SỐNG HẤP HỐI';
  } else {
    status = 'HẸO';
  }

  // Random variant 1..5
  const variantId = Math.floor(Math.random() * 5) + 1;

  return {
    errorScore,
    survivalScore,
    status,
    variantId,
  };
}
