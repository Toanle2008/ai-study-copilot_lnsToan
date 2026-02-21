
export const HARDCODED_SUMMARIES: Record<string, any> = {
  'Bài 1: Tính đơn điệu và cực trị của hàm số': {
    title: 'Giải tích 12: Chuyên sâu về Tính đơn điệu và Cực trị',
    briefing: 'Nghiên cứu sự biến thiên của hàm số $y=f(x)$ thông qua đạo hàm cấp 1 và cấp 2. Phân tích các điều kiện cần và đủ để hàm số đạt cực trị, đồng thời khảo sát tính đơn điệu trên các tập hợp số thực phức tạp.',
    keyConcepts: [
      { term: 'Định lý Lagrange & Tính đơn điệu', definition: 'Dựa trên định lý giá trị trung bình, nếu $f\'(x) > 0$ trên $(a, b)$ thì hàm số đồng biến tuyệt đối. Xét trường hợp $f\'(x) = 0$ tại hữu hạn điểm.' },
      { term: 'Tiêu chuẩn Fermat', definition: 'Nếu hàm số đạt cực trị tại $x_0$ và có đạo hàm tại đó thì $f\'(x_0) = 0$. Đây là điều kiện cần nhưng chưa đủ.' },
      { term: 'Dấu hiệu đạo hàm cấp 2', definition: 'Nếu $f\'(x_0) = 0$ và $f\'\'(x_0) < 0$, hàm số đạt cực đại tại $x_0$. Nếu $f\'\'(x_0) > 0$, hàm số đạt cực tiểu tại $x_0$.' },
      { term: 'Điểm dừng & Điểm tới hạn', definition: 'Phân biệt điểm mà đạo hàm bằng 0 (điểm dừng) và điểm mà đạo hàm không tồn tại nhưng hàm số liên tục (điểm tới hạn).' }
    ],
    mindmap: [
      { node: 'Khảo sát đơn điệu', children: ['Tập xác định $D$', 'Đạo hàm $f\'(x)$', 'Xét dấu $f\'(x)$ qua các nghiệm và điểm gián đoạn', 'Bảng biến thiên (BBT)', 'Kết luận khoảng đơn điệu'] },
      { node: 'Cực trị chuyên sâu', children: ['Quy tắc 1: Đổi dấu đạo hàm cấp 1', 'Quy tắc 2: Dấu đạo hàm cấp 2', 'Cực trị hàm chứa dấu giá trị tuyệt đối', 'Cực trị hàm hợp $g(x) = f(u(x))$'] },
      { node: 'Ứng dụng & VDC', children: ['Biện luận tham số $m$ cho tính đơn điệu', 'Tìm $m$ để hàm số có $n$ điểm cực trị', 'Bài toán tối ưu hóa thực tế', 'Hàm ẩn và đồ thị đạo hàm'] }
    ],
    qa: [
      { question: 'Tại sao hàm số $y = \frac{ax+b}{cx+d}$ không bao giờ có cực trị?', answer: 'Vì đạo hàm $y\' = \frac{ad-bc}{(cx+d)^2}$ luôn cùng dấu (hoặc không xác định) trên từng khoảng xác định, không bao giờ đổi dấu.' },
      { question: 'Điều kiện để hàm số bậc 3 có 2 điểm cực trị là gì?', answer: 'Đạo hàm là hàm bậc 2 phải có 2 nghiệm phân biệt, tương đương $\Delta_{y\'} > 0$.' },
      { question: 'Hàm số có thể đạt cực trị tại điểm mà đạo hàm không tồn tại không?', answer: 'Có, ví dụ hàm $y = |x|$ đạt cực tiểu tại $x=0$ dù đạo hàm không tồn tại tại đó, vì đạo hàm đổi dấu từ âm sang dương.' }
    ]
  },
  'Bài 11: Tích phân': {
    title: 'Toán học Cao cấp: Lý thuyết Tích phân và Ứng dụng',
    briefing: 'Tích phân xác định theo định nghĩa Riemann và phương pháp tính thông qua nguyên hàm. Nghiên cứu các kỹ thuật biến đổi nâng cao và ứng dụng trong tính toán hình học, vật lý hiện đại.',
    keyConcepts: [
      { term: 'Định lý cơ bản của Giải tích', definition: 'Kết nối giữa đạo hàm và tích phân: $\int_a^b f(x)dx = F(b) - F(a)$. $F(x)$ là nguyên hàm của $f(x)$ trên $[a, b]$.' },
      { term: 'Phương pháp đổi biến số (Substitution)', definition: 'Loại 1: Đặt $u = u(x) \Rightarrow du = u\'(x)dx$. Loại 2: Đặt $x = \phi(t)$ (thường dùng cho hàm chứa căn thức bậc hai của tam thức bậc hai).' },
      { term: 'Tích phân từng phần (Integration by Parts)', definition: 'Dựa trên quy tắc đạo hàm của một tích: $\int u dv = uv - \int v du$. Kỹ thuật chọn $u$ theo thứ tự ưu tiên: Logarit, Đa thức, Lượng giác, Mũ.' },
      { term: 'Tích phân hàm ẩn', definition: 'Kỹ thuật tính tích phân dựa trên các phương trình hàm hoặc tính chất đối xứng của hàm số mà không cần tìm biểu thức cụ thể của hàm.' }
    ],
    mindmap: [
      { node: 'Cơ sở lý thuyết', children: ['Định nghĩa tổng Riemann', 'Tính chất tuyến tính', 'Tính chất cộng đoạn', 'Bất đẳng thức tích phân'] },
      { node: 'Chiến thuật tính toán', children: ['Bảng nguyên hàm mở rộng', 'Đổi biến số (Vạn năng, Lượng giác hóa)', 'Từng phần lặp (Tích phân luân hồi)', 'Phân tách phân thức hữu tỉ'] },
      { node: 'Ứng dụng thực tiễn', children: ['Diện tích hình phẳng (Sử dụng trị tuyệt đối)', 'Thể tích khối tròn xoay (Quay quanh Ox, Oy)', 'Độ dài đường cong', 'Công và áp suất trong vật lý'] }
    ],
    qa: [
      { question: 'Khi nào ta nên dùng tích phân từng phần lặp?', answer: 'Khi gặp tích của hàm mũ và lượng giác ($\int e^x \cos x dx$), sau hai lần từng phần ta sẽ thu lại biểu thức ban đầu và giải phương trình đại số.' },
      { question: 'Ý nghĩa hình học của tích phân xác định là gì?', answer: 'Là diện tích đại số của hình phẳng giới hạn bởi đồ thị hàm số, trục hoành và hai đường thẳng đứng $x=a, x=b$.' },
      { question: 'Làm sao để tính tích phân hàm lẻ trên đoạn đối xứng $[-a, a]$?', answer: 'Kết quả luôn bằng 0 do tính đối xứng qua gốc tọa độ, các phần diện tích triệt tiêu nhau.' }
    ]
  },
  'Bài 7: Dao động điều hòa': {
    title: 'Vật lý Đại cương: Động lực học Dao động điều hòa',
    briefing: 'Phân tích chuyển động tuần hoàn của hệ cơ học dưới tác dụng của lực kéo về tỉ lệ với li độ. Nghiên cứu các phương diện động học, động lực học và năng lượng của hệ dao động.',
    keyConcepts: [
      { term: 'Phương trình vi phân đạo hàm bậc hai', definition: 'Nghiệm của phương trình $x\'\' + \omega^2 x = 0$ có dạng $x = A\cos(\omega t + \phi)$. Đây là mô tả toán học của dao động điều hòa.' },
      { term: 'Vector quay Fresnel', definition: 'Biểu diễn dao động điều hòa bằng một vector có độ dài $A$ quay với tốc độ góc $\omega$. Giúp đơn giản hóa việc tổng hợp dao động.' },
      { term: 'Bảo toàn cơ năng', definition: 'Trong hệ kín không ma sát, tổng động năng và thế năng là hằng số: $E = \frac{1}{2}mv^2 + \frac{1}{2}kx^2 = \frac{1}{2}kA^2$.' },
      { term: 'Độ lệch pha (Phase Difference)', definition: '$\Delta \phi = \phi_2 - \phi_1$. Xác định trạng thái tương đối giữa hai dao động (Cùng pha, ngược pha, vuông pha).' }
    ],
    mindmap: [
      { node: 'Động học dao động', children: ['Li độ: $x = A\cos(\omega t + \phi)$', 'Vận tốc: $v = x\' = -\omega A\sin(\omega t + \phi)$', 'Gia tốc: $a = v\' = -\omega^2 x$'] },
      { node: 'Động lực học', children: ['Lực kéo về: $F = -kx$', 'Con lắc lò xo: $\omega = \sqrt{k/m}$', 'Con lắc đơn: $\omega = \sqrt{g/l}$'] },
      { node: 'Phân tích năng lượng', children: ['Động năng: Biến thiên với tần số $2f$', 'Thế năng: Biến thiên tuần hoàn', 'Cơ năng: Không đổi theo thời gian'] },
      { node: 'Ứng dụng toán học', children: ['Vòng tròn lượng giác đa năng', 'Số phức trong tổng hợp dao động', 'Phân tích đồ thị li độ - thời gian'] }
    ],
    qa: [
      { question: 'Tại sao vận tốc đạt cực đại tại vị trí cân bằng?', answer: 'Tại VTCB, thế năng bằng 0, theo định luật bảo toàn cơ năng thì động năng phải đạt cực đại, dẫn đến vận tốc cực đại $v_{max} = \omega A$.' },
      { question: 'Sự khác biệt giữa tần số góc và tần số là gì?', answer: 'Tần số góc $\omega$ (rad/s) đo tốc độ quay của vector Fresnel, còn tần số $f$ (Hz) đo số dao động toàn phần trong một giây. Liên hệ: $\omega = 2\pi f$.' },
      { question: 'Lực kéo về có đặc điểm gì quan trọng?', answer: 'Luôn hướng về vị trí cân bằng và có độ lớn tỉ lệ thuận với khoảng cách từ vật đến VTCB.' }
    ]
  },
  'Este - Lipit': {
    title: 'Hóa học Hữu cơ: Chuyên sâu về Este và dẫn xuất Acid béo',
    briefing: 'Nghiên cứu cấu trúc phân tử, cơ chế phản ứng este hóa và thủy phân. Phân tích vai trò sinh học và ứng dụng công nghiệp của Lipit trong đời sống hiện đại.',
    keyConcepts: [
      { term: 'Cơ chế phản ứng Este hóa', definition: 'Phản ứng thuận nghịch giữa Acid và Alcohol có xúc tác $H_2SO_4$ đặc. Cơ chế thế nhóm $-OH$ của acid bằng nhóm $-OR\'$ của alcohol.' },
      { term: 'Phản ứng Saponification', definition: 'Thủy phân este trong môi trường kiềm (NaOH/KOH). Đây là phản ứng một chiều tạo ra muối carboxylate (xà phòng) và alcohol.' },
      { term: 'Cấu trúc Triglyceride', definition: 'Triester của Glycerol với các acid béo mạch dài. Phân loại dựa trên độ bão hòa của gốc hydrocarbon (No và Không no).' },
      { term: 'Chỉ số Acid & Chỉ số Iodine', definition: 'Các thông số kỹ thuật đánh giá chất lượng chất béo: lượng acid tự do và mức độ chưa bão hòa của các liên kết đôi.' }
    ],
    mindmap: [
      { node: 'Este đơn chức', children: ['Công thức: $C_nH_{2n}O_2$ ($n \ge 2$)', 'Danh pháp IUPAC và tên thông thường', 'Tính chất vật lý: Liên kết dipole-dipole', 'Phản ứng tráng gương của Formate'] },
      { node: 'Lipit & Chất béo', children: ['Acid béo bão hòa (Palmitic, Stearic)', 'Acid béo chưa bão hòa (Oleic, Linoleic)', 'Trạng thái vật lý: Rắn (mỡ) và Lỏng (dầu)', 'Sự ôi thiu của chất béo'] },
      { node: 'Kỹ thuật giải toán', children: ['Bảo toàn khối lượng trong xà phòng hóa', 'Phương pháp trung bình cho hỗn hợp este', 'Độ bất bão hòa $k$ và phản ứng cộng $Br_2$', 'Bảo toàn nguyên tố C, H, O'] }
    ],
    qa: [
      { question: 'Tại sao phản ứng este hóa cần $H_2SO_4$ đặc?', answer: 'Đóng vai trò kép: Vừa là xúc tác tăng tốc độ phản ứng, vừa là chất hút nước để chuyển dịch cân bằng hóa học sang chiều tạo este.' },
      { question: 'Làm thế nào để phân biệt dầu ăn và dầu bôi trơn máy?', answer: 'Dầu ăn là este (lipit) nên bị thủy phân trong kiềm; dầu máy là hydrocarbon nên không phản ứng với kiềm.' },
      { question: 'Este nào có mùi chuối chín đặc trưng?', answer: 'Isoamyl acetate ($CH_3COOCH_2CH_2CH(CH_3)_2$).' }
    ]
  },
  'Vợ chồng A Phủ': {
    title: 'Văn học Hiện đại: Phân tích Tư tưởng và Nghệ thuật trong Vợ chồng A Phủ',
    briefing: 'Khám phá chiều sâu tâm hồn con người Tây Bắc qua ngòi bút hiện thực và nhân đạo của Tô Hoài. Phân tích sự trỗi dậy của sức sống tiềm tàng và con đường tự giải phóng của người lao động.',
    keyConcepts: [
      { term: 'Sức sống tiềm tàng', definition: 'Sức mạnh nội tại âm ỉ, không bao giờ mất đi, chỉ chờ cơ hội để bùng phát mạnh mẽ, đưa con người vượt qua nghịch cảnh.' },
      { term: 'Cơ chế tê liệt tâm hồn', definition: 'Trạng thái buông xuôi, cam chịu của Mị do sự áp bức kéo dài của cường quyền và thần quyền (hủ tục cúng trình ma).' },
      { term: 'Nghệ thuật trần thuật', definition: 'Cách kể chuyện linh hoạt, kết hợp giữa miêu tả ngoại cảnh và phân tích nội tâm tinh tế, đậm đà bản sắc văn hóa vùng cao.' },
      { term: 'Biểu tượng Tiếng sáo', definition: 'Sợi dây liên kết giữa hiện tại khổ đau và quá khứ tươi đẹp, là tiếng gọi của tình yêu, tự do và khát vọng sống.' }
    ],
    mindmap: [
      { node: 'Hình tượng nhân vật Mị', children: ['Vẻ đẹp tiềm ẩn: Tài hoa, hiếu thảo', 'Bi kịch: Nô lệ gạt nợ, bị tước đoạt quyền sống', 'Sự thức tỉnh: Đêm tình mùa xuân (Tiếng sáo)', 'Hành động quyết định: Đêm đông cắt dây cởi trói'] },
      { node: 'Nhân vật A Phủ', children: ['Tính cách: Phóng khoáng, gan góc, yêu tự do', 'Bi kịch: Nạn nhân của cường quyền và hủ tục', 'Sự gặp gỡ: Đồng bệnh tương lân với Mị'] },
      { node: 'Giá trị tác phẩm', children: ['Giá trị hiện thực: Bộ mặt tàn bạo của chúa đất', 'Giá trị nhân đạo: Trân trọng khát vọng con người', 'Giá trị thẩm mỹ: Ngôn ngữ giàu hình ảnh, nhịp điệu'] }
    ],
    qa: [
      { question: 'Ý nghĩa của chi tiết "căn buồng Mị nằm có một chiếc cửa sổ lỗ vuông bằng bàn tay"?', answer: 'Biểu tượng cho ngục thất tinh thần, sự giam hãm và mất tự do hoàn toàn của con người trong chế độ phong kiến miền núi.' },
      { question: 'Tại sao Mị lại cứu A Phủ dù trước đó cô dường như đã vô cảm?', answer: 'Sự đồng cảm giữa những người cùng khổ ("giọt nước mắt" của A Phủ) đã đánh thức lòng nhân hậu và bản năng phản kháng trong Mị.' },
      { question: 'Vai trò của thiên nhiên Tây Bắc trong tác phẩm?', answer: 'Không chỉ là phông nền mà còn tham gia vào diễn biến tâm lý nhân vật, gợi nhắc về sức sống và vẻ đẹp hoang sơ, mãnh liệt.' }
    ]
  }
};

export const HARDCODED_PLANS: Record<string, any> = {
  'Tích phân': {
    strategicGoals: [
      'Nắm vững hệ thống 15 công thức nguyên hàm cơ bản và mở rộng (hàm hợp)',
      'Thành thạo kỹ thuật biến đổi vi phân và đổi biến số loại 1, loại 2',
      'Ứng dụng tích phân giải quyết các bài toán tối ưu hóa hình học và vật lý kỹ thuật'
    ],
    tasks: [
      { title: 'Hệ thống hóa lý thuyết Nguyên hàm', description: 'Xây dựng bảng đối chiếu đạo hàm - nguyên hàm. Phân tích tính chất tuyến tính và các định lý tồn tại nguyên hàm. Hoàn thành 25 câu hỏi nhận biết.', category: 'lesson', sourceCitation: 'Giáo trình Giải tích 12 nâng cao', priority: 'High' },
      { title: 'Chuyên đề Biến đổi Vi phân', description: 'Luyện tập kỹ thuật "đưa vào dấu vi phân" $f(u(x))u\'(x)dx = f(u)du$. Giải quyết các dạng hàm ẩn trong căn và hàm lượng giác phức hợp.', category: 'practice', sourceCitation: 'Tài liệu bồi dưỡng tư duy toán học', priority: 'High' },
      { title: 'Kỹ thuật Tích phân từng phần nâng cao', description: 'Áp dụng công thức $\int u dv$ cho các hàm hỗn hợp. Thực hành kỹ thuật tích phân luân hồi và phương pháp sơ đồ cột (múa cột) cho các bài toán VDC.', category: 'practice', sourceCitation: 'Tuyển tập chuyên đề toán học 12', priority: 'High' },
      { title: 'Ứng dụng Hình học & Vật lý', description: 'Tính diện tích hình phẳng giới hạn bởi nhiều đường cong. Tính thể tích vật thể có thiết diện cho trước và vật thể tròn xoay.', category: 'practice', sourceCitation: 'Đề thi đánh giá năng lực ĐHQG', priority: 'High' },
      { title: 'Phân tích và Khắc phục lỗi sai', description: 'Rà soát các lỗi phổ biến: quên đổi cận khi đổi biến, nhầm lẫn công thức nguyên hàm của hàm hợp, sai sót trong tính toán số học.', category: 'review', sourceCitation: 'Sổ tay phân tích lỗi sai cá nhân', priority: 'Medium' }
    ]
  },
  'Dao động điều hòa': {
    strategicGoals: [
      'Làm chủ hệ thống đại lượng động học và động lực học qua phương trình vi phân',
      'Sử dụng thành thạo vòng tròn lượng giác đa năng và số phức trong giải toán nhanh',
      'Phân tích sâu các bài toán năng lượng và sự chuyển hóa trong các hệ dao động phức hợp'
    ],
    tasks: [
      { title: 'Thiết lập phương trình Dao động', description: 'Chứng minh phương trình dao động từ định luật II Newton. Xác định các đại lượng $A, \omega, \phi$ từ điều kiện ban đầu.', category: 'lesson', sourceCitation: 'Vật lý 12 - Bộ sách Chân trời sáng tạo', priority: 'High' },
      { title: 'Kỹ thuật Vòng tròn lượng giác đa năng', description: 'Giải quyết bài toán thời gian, quãng đường, tốc độ trung bình và số lần vật đi qua vị trí $x_0$. Làm 40 câu trắc nghiệm vận dụng.', category: 'practice', sourceCitation: 'Cẩm nang giải nhanh Vật lý THPT', priority: 'High' },
      { title: 'Động lực học Con lắc lò xo & Con lắc đơn', description: 'Khảo sát lực đàn hồi, lực hồi phục và các trường hợp con lắc chịu thêm ngoại lực (điện trường, quán tính).', category: 'practice', sourceCitation: 'Chuyên đề Vật lý nâng cao', priority: 'High' },
      { title: 'Phân tích Đồ thị và Năng lượng', description: 'Kỹ năng khai thác dữ liệu từ đồ thị li độ, vận tốc, gia tốc và năng lượng theo thời gian. Giải 15 bài tập đồ thị mức độ VDC.', category: 'practice', sourceCitation: 'Tuyển tập đề thi chính thức Bộ GD', priority: 'High' },
      { title: 'Ứng dụng Số phức (Casio)', description: 'Sử dụng phương pháp số phức để tổng hợp các dao động cùng phương, cùng tần số và tìm các đại lượng thành phần.', category: 'review', sourceCitation: 'Kỹ thuật bấm máy Casio Vật lý', priority: 'Medium' }
    ]
  },
  'Khảo sát hàm số': {
    strategicGoals: [
      'Thành thạo quy trình khảo sát hàm số và biện luận tính chất đồ thị',
      'Nhận diện nhanh cấu trúc hàm số và các hệ số đặc trưng từ dáng điệu đồ thị',
      'Giải quyết các bài toán tương giao, tiếp tuyến và điểm đặc biệt trên đồ thị'
    ],
    tasks: [
      { title: 'Quy trình Khảo sát chuẩn hóa', description: 'Thực hành khảo sát đầy đủ cho hàm đa thức bậc 3, bậc 4 và hàm phân thức nhất biến. Chú ý các điểm uốn và tâm đối xứng.', category: 'lesson', sourceCitation: 'Sách giáo khoa Toán 12 hiện hành', priority: 'High' },
      { title: 'Kỹ thuật Nhận diện Đồ thị nhanh', description: 'Phân tích dấu của các hệ số $a, b, c, d$ dựa trên giao điểm với trục tung, trục hoành và các điểm cực trị. Làm 50 câu trắc nghiệm.', category: 'practice', sourceCitation: 'Ngân hàng đề thi trắc nghiệm Toán', priority: 'High' },
      { title: 'Lý thuyết Tiệm cận chuyên sâu', description: 'Xác định tiệm cận đứng, ngang và tiệm cận xiên (nếu có) bằng giới hạn. Phân tích các trường hợp hàm chứa căn thức.', category: 'practice', sourceCitation: 'Toán học tuổi trẻ - Chuyên đề hàm số', priority: 'Medium' },
      { title: 'Tương giao & Biện luận nghiệm', description: 'Sử dụng phương pháp đồ thị để biện luận số nghiệm của phương trình chứa tham số. Giải các bài toán về khoảng cách và diện tích liên quan đến tương giao.', category: 'practice', sourceCitation: 'Đề thi thử các trường chuyên toàn quốc', priority: 'High' }
    ]
  },
  'Este - Lipit': {
    strategicGoals: [
      'Nắm vững bản chất liên kết hóa học và cơ chế phản ứng của Este/Lipit',
      'Giải quyết thành thạo các dạng bài toán đốt cháy, thủy phân và xác định cấu tạo',
      'Hiểu rõ ứng dụng thực tiễn và quy trình sản xuất công nghiệp của chất béo'
    ],
    tasks: [
      { title: 'Cấu tạo & Danh pháp IUPAC', description: 'Viết và gọi tên các đồng phân este mạch hở và este vòng. Phân tích ảnh hưởng của cấu trúc đến tính chất vật lý.', category: 'lesson', sourceCitation: 'Hóa học 12 - Bộ sách Kết nối tri thức', priority: 'High' },
      { title: 'Cơ chế phản ứng Thủy phân', description: 'So sánh phản ứng thủy phân trong môi trường acid (thuận nghịch) và môi trường kiềm (một chiều). Viết phương trình cho các trường hợp đặc biệt.', category: 'practice', sourceCitation: 'Giáo trình Hóa học hữu cơ chuyên sâu', priority: 'High' },
      { title: 'Chuyên đề Bài toán Đốt cháy', description: 'Áp dụng công thức tổng quát $n_{CO_2} - n_{H_2O} = (k-1)n_{este}$. Sử dụng bảo toàn khối lượng và bảo toàn nguyên tố O.', category: 'practice', sourceCitation: 'Phương pháp giải nhanh Hóa học hữu cơ', priority: 'High' },
      { title: 'Lipit & Công nghệ Xà phòng hóa', description: 'Phân tích cấu trúc các acid béo omega-3, omega-6. Tính toán hiệu suất quy trình sản xuất xà phòng và chất tẩy rửa tổng hợp.', category: 'practice', sourceCitation: 'Hóa học và Đời sống', priority: 'Medium' }
    ]
  },
  'Vợ chồng A Phủ': {
    strategicGoals: [
      'Phân tích đa chiều diễn biến tâm lý và sức sống tiềm tàng của nhân vật Mị',
      'Đánh giá giá trị hiện thực, nhân đạo và những sáng tạo nghệ thuật độc đáo của Tô Hoài',
      'Kiến tạo các tiểu luận nghị luận văn học có tính phản biện và chiều sâu tư duy'
    ],
    tasks: [
      { title: 'Giải mã Văn bản học', description: 'Nghiên cứu bối cảnh sáng tác "Truyện Tây Bắc". Phân tích các lớp nghĩa của hình ảnh thiên nhiên và phong tục tập quán.', category: 'lesson', sourceCitation: 'Ngữ văn 12 - Tập 2 (Chương trình mới)', priority: 'High' },
      { title: 'Hệ thống hóa hình tượng nhân vật', description: 'Xây dựng sơ đồ tư duy về cuộc đời Mị. Phân tích các bước ngoặt tâm lý từ sự tê liệt đến sự trỗi dậy mãnh liệt.', category: 'practice', sourceCitation: 'Phê bình văn học: Chuyên đề Tô Hoài', priority: 'High' },
      { title: 'Đặc sắc Nghệ thuật & Ngôn ngữ', description: 'Phân tích nghệ thuật miêu tả nội tâm, cách sử dụng ngôn ngữ đậm chất miền núi và vai trò của người kể chuyện.', category: 'practice', sourceCitation: 'Tạp chí Văn học và Tuổi trẻ', priority: 'Medium' },
      { title: 'Luyện kỹ năng Nghị luận văn học', description: 'Viết bài văn phân tích sự giao thoa giữa giá trị hiện thực và giá trị nhân đạo trong tác phẩm. Thực hành đề thi THPTQG.', category: 'practice', sourceCitation: 'Bộ đề ôn luyện Ngữ văn chuyên sâu', priority: 'High' }
    ]
  }
};

export const DEFAULT_SUMMARY = {
  title: 'Chuyên đề Nghiên cứu học thuật',
  briefing: 'Hệ thống kiến thức đang được cấu trúc lại theo tiêu chuẩn học thuật chuyên sâu. Nội dung bao gồm các định nghĩa cốt lõi, nguyên lý vận dụng và các phân tích chuyên môn dựa trên chương trình giáo dục phổ thông mới.',
  keyConcepts: [
    { term: 'Hệ thống khái niệm nền tảng', definition: 'Các định nghĩa mang tính nguyên lý, là cơ sở để xây dựng tư duy logic và giải quyết các vấn đề phức tạp trong chủ đề.' },
    { term: 'Mô hình vận dụng thực tiễn', definition: 'Phương pháp chuyển hóa lý thuyết thành các mô hình giải quyết bài tập và ứng dụng vào các hiện tượng thực tế trong đời sống.' },
    { term: 'Phân tích chuyên sâu & Lưu ý', definition: 'Các điểm trọng yếu dễ gây nhầm lẫn, các kỹ thuật tối ưu hóa quy trình tư duy và các mẹo ghi nhớ dựa trên tâm lý học giáo dục.' }
  ],
  mindmap: [
    { node: 'Giai đoạn 1: Kiến tạo tri thức', children: ['Xác lập hệ thống định nghĩa và định lý', 'Phân tích mối liên hệ logic giữa các thành phần', 'Xây dựng sơ đồ cấu trúc kiến thức tổng quát'] },
    { node: 'Giai đoạn 2: Phát triển kỹ năng', children: ['Nhận diện và phân loại các dạng toán/vấn đề', 'Thiết lập quy trình giải quyết tối ưu từng bước', 'Ứng dụng công nghệ và công cụ hỗ trợ (Casio, Phần mềm)'] },
    { node: 'Giai đoạn 3: Đánh giá & Mở rộng', children: ['Phân tích các tình huống vận dụng cao (VDC)', 'Tổng hợp và phản biện các lỗi sai thường gặp', 'Kết nối kiến thức liên môn và ứng dụng thực tiễn'] }
  ],
  qa: [
    { question: 'Làm thế nào để đạt được mức độ thông hiểu sâu sắc cho chủ đề này?', answer: 'Cần thực hiện quy trình: Đọc hiểu bản chất -> Vẽ sơ đồ tư duy cá nhân -> Giải quyết bài tập đa dạng -> Tự đặt câu hỏi phản biện về các trường hợp ngoại lệ.' },
    { question: 'Cấu trúc đề thi thường tập trung vào những khía cạnh nào?', answer: 'Đề thi thường đánh giá khả năng kết hợp giữa kiến thức nền tảng và tư duy vận dụng linh hoạt. Cần đặc biệt chú trọng các câu hỏi mang tính phân loại cao.' }
  ]
};

export const DEFAULT_PLAN = {
  strategicGoals: [
    'Xác lập nền tảng tri thức vững chắc và hệ thống hóa kiến thức chuyên sâu',
    'Phát triển kỹ năng giải quyết vấn đề thông qua các dạng bài tập thực hành đa tầng',
    'Tối ưu hóa hiệu suất học tập và rèn luyện tư duy phản biện trong quá trình ôn tập'
  ],
  tasks: [
    { title: 'Nghiên cứu Lý thuyết hệ thống', description: 'Phân tích sâu các tài liệu chuẩn mực, kết hợp bài giảng chuyên gia để nắm bắt các khía cạnh tinh vi của lý thuyết.', category: 'lesson', sourceCitation: 'Hệ thống giáo trình & Học liệu số', priority: 'High' },
    { title: 'Thực hành Kỹ năng cơ bản', description: 'Hoàn thành bộ câu hỏi đánh giá năng lực mức độ nhận biết và thông hiểu để củng cố các quy trình chuẩn.', category: 'practice', sourceCitation: 'Ngân hàng câu hỏi chuẩn hóa', priority: 'High' },
    { title: 'Vận dụng cao & Giải quyết vấn đề', description: 'Thử thách với các bài toán tích hợp, các tình huống thực tế đòi hỏi tư duy logic và khả năng tổng hợp kiến thức.', category: 'practice', sourceCitation: 'Tuyển tập đề thi phân loại cao', priority: 'Medium' },
    { title: 'Kiểm định & Hiệu chỉnh tri thức', description: 'Thực hiện các bài đánh giá định kỳ để nhận diện lỗ hổng kiến thức và thực hiện các bước hiệu chỉnh kịp thời.', category: 'review', sourceCitation: 'Hệ thống đánh giá AI thông minh', priority: 'Medium' },
    { title: 'Kiến tạo Sơ đồ tư duy cá nhân', description: 'Tự thiết kế hệ thống ghi nhớ trực quan để tối ưu hóa khả năng truy xuất thông tin và khắc sâu kiến thức.', category: 'review', sourceCitation: 'Hồ sơ học tập cá nhân', priority: 'Low' }
  ]
};
