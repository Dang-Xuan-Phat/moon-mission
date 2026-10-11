import { MemeVariant } from '@/types/game';

export const STATUS_MESSAGES: MemeVariant[] = [
  // 10.1 SỐNG • 70–100 điểm
  {
    id: 1,
    status: 'SỐNG',
    paragraph:
      'Không đùa đâu, bài này của bạn nhìn khá uy tín. Bạn không kéo bừa cho có mà thật sự có suy nghĩ, biết món nào nên ưu tiên trước, món nào nên để sau. Bảng xếp hạng của bạn chưa chắc giống chuyên gia 100%, nhưng đủ để người ta nhìn vào và gật đầu kiểu “ừ, người này có não thật”. Nói chung nếu đây là nhiệm vụ thật thì bạn vẫn đang đi đúng đường, chưa làm ai trong trung tâm điều khiển phải ôm đầu.',
    bullets: [
      'Não: online',
      'Logic: ổn áp',
      'Chiến thuật: có bài',
      'NASA: tạm yên tâm',
      'Độ uy tín: +100 aura',
    ],
  },
  {
    id: 2,
    status: 'SỐNG',
    paragraph:
      'Bài làm này có mùi của người biết mình đang làm gì. Không phải kiểu gặp 15 món đồ rồi chọn theo cảm giác, mà là có cân nhắc, có ưu tiên, có chiến lược hẳn hoi. Bạn không cần phải là thiên tài vũ trụ, chỉ cần giữ phong độ như hiện tại là đủ khiến hệ thống đánh giá rằng: ừ, người này còn cứu được và còn cứu khá ngon lành nữa.',
    bullets: [
      'Não: chạy mượt',
      'Trực giác: đúng chỗ',
      'Meta: bám khá chuẩn',
      'Trung tâm điều khiển: bớt lo',
      'Danh hiệu: người chơi biết nghĩ',
    ],
  },
  {
    id: 3,
    status: 'SỐNG',
    paragraph:
      'Nhìn chung bạn xử lý ngon đấy. Có vài chỗ lệch nhẹ nhưng tổng thể vẫn rất sáng cửa. Cái hay là bạn không bị cuốn vào mấy món nhìn có vẻ “ngầu” nhưng thực ra không quan trọng bằng các nhu cầu sống còn. Tức là bạn không chỉ chọn cho vui mắt, mà chọn đúng thứ đáng ưu tiên trước. Nói ngắn gọn thì bạn đang chơi hệ tư duy ổn định, chưa cần ai nhắc nhở nhiều.',
    bullets: [
      'Tư duy: tỉnh táo',
      'Thứ tự ưu tiên: khá chuẩn',
      'Độ bình tĩnh: tốt',
      'NASA: chấm nhẹ một like',
      'Khí chất: người biết game này không phải trò may rủi',
    ],
  },
  {
    id: 4,
    status: 'SỐNG',
    paragraph:
      'Có thể bạn không đứng số 1 toàn lớp, nhưng bảng của bạn đủ ổn để người khác nhìn vào thấy nể. Bạn chọn theo hướng thực tế, biết cái gì là sống còn, cái gì chỉ là phụ trợ, và đó chính là khác biệt lớn nhất. Kết quả này cho thấy đầu bạn vẫn rất tỉnh khi phải ra quyết định nhanh. Nếu đây là tình huống thật thì bạn là kiểu người không làm team hoảng loạn thêm.',
    bullets: [
      'Não: sắc nét',
      'Quyết định: hợp lý',
      'Khả năng sinh tồn: có cửa đẹp',
      'Team tưởng tượng: muốn đi chung',
      'Độ tin cậy: cao',
    ],
  },
  {
    id: 5,
    status: 'SỐNG',
    paragraph:
      'Bài của bạn mang vibe “ít nói nhưng làm được việc”. Không màu mè, không phá cách vô lý, chỉ đơn giản là chọn đúng những thứ cần thiết trước. Đó mới là cái đáng nói. Cái hay của bạn là biết gạt bớt những món nghe có vẻ hấp dẫn để giữ chỗ cho mấy món thật sự quan trọng. Kết quả này đủ để nói rằng bạn không chỉ đang sống, mà còn đang sống có chiến lược.',
    bullets: [
      'Não: đang hoạt động hết công suất',
      'Phán đoán: đáng tin',
      'Lối chơi: chắc tay',
      'NASA: chưa cần họp khẩn',
      'Vibe chung: người này ổn nè',
    ],
  },

  // 10.2 SỐNG HẤP HỐI • 40–69 điểm
  {
    id: 6,
    status: 'SỐNG HẤP HỐI',
    paragraph:
      'Bài của bạn không đến mức quá toang, nhưng cũng chưa đủ để người ta hoàn toàn an tâm. Có mấy lựa chọn khá ổn, chứng tỏ bạn có nghĩ, nhưng xen giữa đó vẫn có vài pha sắp xếp làm người xem phải nghiêng đầu một chút. Cảm giác chung là bạn đang đi đúng hướng, chỉ là thỉnh thoảng lại rẽ hơi mạnh sang làn của trực giác. Vẫn cứu được, nhưng hệ thống xin phép lo nhẹ.',
    bullets: [
      'Não: vẫn online',
      'Logic: lúc căng lúc chùng',
      'Chiến thuật: nửa meta nửa freestyle',
      'NASA: đang check lại đáp án',
      'Độ uy tín: còn nhưng hơi rung',
    ],
  },
  {
    id: 7,
    status: 'SỐNG HẤP HỐI',
    paragraph:
      'Bạn có cái chất của người gần đúng, nhưng chưa đúng hẳn. Tức là nhìn vào không thể bảo bạn chọn bừa, nhưng cũng chưa thể mạnh dạn nói là bạn nắm game rất chắc. Có món bạn ưu tiên đúng bài, có món lại khiến người ta tự hỏi là bạn nhìn thấy điều gì sâu xa mà người khác chưa nhìn ra. Nói chung vẫn còn cửa đẹp, chỉ là chưa đủ đẹp để thả lỏng.',
    bullets: [
      'Tư duy: có nhưng hơi thất thường',
      'Trực giác: hơi nhiều đất diễn',
      'Độ ổn định: đang thương lượng',
      'NASA: nhíu mày nhẹ',
      'Đồng đội tưởng tượng: hơi rén nhưng vẫn tin',
    ],
  },
  {
    id: 8,
    status: 'SỐNG HẤP HỐI',
    paragraph:
      'Nói một cách công bằng thì bạn vẫn đang ổn, chỉ là cái chữ “ổn” ở đây phải gánh hơi nhiều việc. Bài của bạn có vài đoạn rất sáng, xong lại xuất hiện một lựa chọn khiến tổng thể chao đảo đôi chút. Kiểu như đang làm bài rất vào form thì tự nhiên chèn vào một pha xử lý khó giải thích. Vẫn chưa out game đâu, nhưng rõ ràng là cần bình tĩnh hơn một nhịp.',
    bullets: [
      'Não: còn pin',
      'Sự tỉnh táo: có lúc lên có lúc xuống',
      'Thứ tự ưu tiên: hơi chệch một xíu',
      'NASA: đọc lại lần hai',
      'Vibe tổng thể: cứu được nhưng phải canh',
    ],
  },
  {
    id: 9,
    status: 'SỐNG HẤP HỐI',
    paragraph:
      'Bảng xếp hạng của bạn cho thấy một điều rất thú vị: bạn có tư duy, nhưng tư duy đó đôi lúc thích đi đường vòng. Có lúc bạn đặt đúng những món cực kỳ quan trọng lên trước, xong lại tự làm khó mình bằng vài quyết định hơi phiêu. Không hẳn sai, nhưng hơi “tại sao lại thế nhỉ?”. Hiện tại bạn vẫn còn trong vùng an toàn tương đối, chỉ là nhìn không được thư thái cho lắm.',
    bullets: [
      'Não: vẫn hoạt động',
      'Lối chơi: hơi khét',
      'Meta: dính nhưng chưa chặt',
      'NASA: im lặng 3 giây',
      'Độ tin cậy: mức vừa đủ dùng',
    ],
  },
  {
    id: 10,
    status: 'SỐNG HẤP HỐI',
    paragraph:
      'Bạn giống kiểu người làm bài có ý tưởng riêng. Điều đó không xấu, nhưng đôi khi ý tưởng riêng đi xa hơi quá thì người chấm cũng bắt đầu run tay. Có thể bạn đang có một logic nội bộ rất riêng, và biết đâu trong đầu bạn mọi thứ đều cực kỳ hợp lý. Chỉ tiếc là so với thứ tự chuyên gia, vẫn còn vài cú sắp xếp khiến kết quả của bạn nằm trong vùng “ổn nhưng đáng lo”.',
    bullets: [
      'Logic: có, nhưng hơi bay',
      'Sự tự tin: rất mạnh',
      'NASA: đang cân nhắc có nên hỏi thêm',
      'Đồng đội tưởng tượng: chưa dám ngủ ngon',
      'Danh hiệu: gần trúng nhưng chưa trúng lắm',
    ],
  },

  // 10.3 HẸO • 0–39 điểm
  {
    id: 11,
    status: 'HẸO',
    paragraph:
      'Nói thật nhé, bài này của bạn rất có cá tính. Tức là không thể bảo là bạn chơi theo lối mòn được, vì rõ ràng bạn đã mở ra một con đường hoàn toàn mới. Vấn đề chỉ là con đường đó đang đi hơi xa khỏi đáp án chuyên gia. Nhìn bảng này xong, người ta sẽ có cảm giác bạn không hề bị ràng buộc bởi những thứ như “thứ tự ưu tiên” hay “logic thông thường”. Bạn chơi bằng bản lĩnh, và đôi khi cả bằng niềm tin nữa.',
    bullets: [
      'Logic: đang loading',
      'Chiến thuật: freestyle toàn tập',
      'NASA: seen',
      'Hệ thống: “Bạn có chắc không?”',
      'Bạn: “Chắc.”',
      'Danh hiệu: Main Character của Mặt Trăng',
    ],
  },
  {
    id: 12,
    status: 'HẸO',
    paragraph:
      'Bài của bạn làm người ta phải dừng lại một nhịp. Không phải vì nó quá giống chuyên gia, mà vì nó quá riêng, quá độc đáo và quá khó đoán. Bạn có vẻ không đi theo meta, cũng không đi theo số đông, mà đang tự xây một hệ quy chiếu mới cho riêng mình. Điều đó rất ngầu, chỉ là trong tình huống này thì nó khiến kết quả của bạn trông giống một màn thử nghiệm táo bạo hơn là một kế hoạch sinh tồn chắc tay.',
    bullets: [
      'Não: có tín hiệu nhưng khó đọc',
      'Meta: tự tạo',
      'NASA: mở cuộc họp nội bộ',
      'Độ tự tin: max level',
      'Khí chất: sáng tạo không giới hạn',
    ],
  },
  {
    id: 13,
    status: 'HẸO',
    paragraph:
      'Có những người làm bài sai vì không nghĩ. Bạn thì khác, bạn làm bài theo kiểu nghĩ rất nhiều nhưng không ai chắc bạn đã nghĩ theo hướng nào. Bảng xếp hạng của bạn có vibe của người nhìn mọi thứ bằng một góc cực kỳ khác biệt. Có thể trong đầu bạn đây là chiến lược đỉnh cao, nhưng so với logic chuyên gia thì nó đang hơi… bay ra ngoài quỹ đạo một chút. Dù sao cũng phải công nhận là bạn chơi không hề nhạt.',
    bullets: [
      'Logic: có vẻ đang đi du lịch',
      'Lối chơi: khó đoán',
      'NASA: gõ gõ bàn phím rồi thôi',
      'Tính sáng tạo: cao bất thường',
      'Danh hiệu: không theo meta vì bạn là meta',
    ],
  },
  {
    id: 14,
    status: 'HẸO',
    paragraph:
      'Bảng này nhìn vào là biết bạn không phải kiểu người thích an toàn. Trong khi người khác lo chọn thứ cần thiết trước, bạn lại có vibe của người muốn tạo điểm nhấn cá nhân ở mọi vị trí. Kết quả là bài của bạn mang màu sắc rất riêng, rất tự tin và cũng rất khó giải thích. Nói ngắn gọn thì nếu game này chấm điểm độ bản lĩnh thì bạn rất cao, còn nếu chấm theo chuyên gia thì… ừm, ta cứ xem như bạn đang mở hướng tiếp cận mới.',
    bullets: [
      'Chiến thuật: không ai đoán được',
      'Sự tự tin: không thể xem thường',
      'NASA: đang cố hiểu',
      'Tình hình: hơi khét',
      'Vibe tổng thể: liều lĩnh nhưng cuốn',
    ],
  },
  {
    id: 15,
    status: 'HẸO',
    paragraph:
      'Bài làm của bạn giống như một lời tuyên bố: “Tôi không chơi theo cách người khác chơi”. Và bạn đã làm đúng như vậy thật. Từng vị trí trong bảng xếp hạng của bạn đều cho thấy tinh thần tự chủ rất cao, gần như không bị ảnh hưởng bởi kỳ vọng thông thường. Đây không hẳn là kết quả gần chuyên gia, nhưng lại là kết quả khiến người xem nhớ lâu. Nói cách khác, nếu mục tiêu là tạo ấn tượng thì bạn đang làm cực tốt.',
    bullets: [
      'Logic: hiện chưa bắt sóng được',
      'Phong cách: độc bản',
      'NASA: đọc xong thở dài nhẹ',
      'Aura: rất mạnh',
      'Danh hiệu: người chơi không bao giờ nhạt',
    ],
  },
];

export function getMemeMessage(status: string, variantId?: number): MemeVariant {
  const filtered = STATUS_MESSAGES.filter((m) => m.status === status);
  if (!filtered.length) {
    return STATUS_MESSAGES[0];
  }
  if (variantId && variantId >= 1 && variantId <= filtered.length) {
    return filtered[variantId - 1];
  }
  return filtered[0];
}
