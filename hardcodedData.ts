
export const HARDCODED_SUMMARIES: Record<string, any> = {
  'Bài 1: Tính đơn điệu và cực trị của hàm số': {
    title: 'Tính đơn điệu và cực trị của hàm số',
    briefing: 'Nghiên cứu sự biến thiên của hàm số thông qua đạo hàm cấp 1, xác định các khoảng đồng biến/nghịch biến và các điểm cực đại/cực tiểu.',
    keyConcepts: [
      { term: 'Định lý đơn điệu', definition: 'Nếu $f\'(x) > 0$ trên $K$ thì hàm số đồng biến; nếu $f\'(x) < 0$ trên $K$ thì hàm số nghịch biến.' },
      { term: 'Điểm cực trị', definition: 'Là điểm $x_0$ mà tại đó $f\'(x)$ đổi dấu. Cực đại khi đổi từ $(+)$ sang $(-)$, cực tiểu khi đổi từ $(-)$ sang $(+)$.' },
      { term: 'Điều kiện đủ', definition: 'Nếu $f\'(x_0) = 0$ và $f\'\'(x_0) < 0$ thì $x_0$ là điểm cực đại; nếu $f\'\'(x_0) > 0$ thì $x_0$ là điểm cực tiểu.' }
    ],
    mindmap: [
      { node: 'Tính đơn điệu', children: ['Tập xác định', 'Tính đạo hàm $y\'$', 'Giải $y\'=0$', 'Lập bảng biến thiên', 'Kết luận khoảng biến thiên'] },
      { node: 'Cực trị', children: ['Quy tắc 1: Xét dấu $y\'$', 'Quy tắc 2: Dùng đạo hàm cấp 2 $y\'\'$', 'Giá trị cực trị $y_{CĐ}, y_{CT}$'] },
      { node: 'Dạng bài tập', children: ['Tìm khoảng đơn điệu', 'Tìm cực trị hàm đa thức', 'Hàm hợp và hàm ẩn (VDC)', 'Bài toán chứa tham số $m$'] }
    ],
    qa: [
      { question: 'Hàm số có thể đồng biến trên tập hợp rời rạc không?', answer: 'Không, tính đơn điệu chỉ xét trên một khoảng, đoạn hoặc nửa khoảng liên tục.' },
      { question: 'Tại sao $y\'=0$ nhưng không có cực trị?', answer: 'Vì đạo hàm không đổi dấu khi đi qua điểm đó (nghiệm bội chẵn).' }
    ]
  },
  'Bài 2: Giá trị lớn nhất và giá trị nhỏ nhất của hàm số': {
    title: 'Giá trị lớn nhất (GTLN) và Giá trị nhỏ nhất (GTNN)',
    briefing: 'Phương pháp tìm giá trị cao nhất và thấp nhất của hàm số trên một tập hợp cho trước, thường là một đoạn $[a, b]$.',
    keyConcepts: [
      { term: 'Định nghĩa GTLN', definition: '$M = \max_{x \in D} f(x)$ nếu $f(x) \le M$ với mọi $x \in D$ và tồn tại $x_0$ sao cho $f(x_0) = M$.' },
      { term: 'Quy tắc trên đoạn', definition: 'Tính $f(a), f(b)$ và các $f(x_i)$ với $x_i$ là nghiệm của $f\'(x)=0$ trong $(a, b)$. So sánh các giá trị này.' },
      { term: 'Ứng dụng thực tế', definition: 'Giải các bài toán tối ưu hóa như tìm diện tích lớn nhất, chi phí nhỏ nhất.' }
    ],
    mindmap: [
      { node: 'Phương pháp tìm', children: ['Trên đoạn $[a, b]$: Tính giá trị tại biên và cực trị', 'Trên khoảng $(a, b)$: Dùng bảng biến thiên', 'Dùng bất đẳng thức (AM-GM, Cauchy-Schwarz)'] },
      { node: 'Các dạng toán', children: ['Hàm đa thức, phân thức', 'Hàm lượng giác, mũ, logarit', 'Bài toán thực tế (Optimization)', 'Tìm $m$ để GTLN/GTNN thỏa điều kiện'] }
    ],
    qa: [
      { question: 'Hàm số liên tục trên một đoạn có luôn có GTLN/GTNN không?', answer: 'Có, theo định lý Weierstrass, hàm số liên tục trên một đoạn luôn đạt được GTLN và GTNN trên đoạn đó.' },
      { question: 'Phân biệt cực đại và GTLN?', answer: 'Cực đại là giá trị lớn nhất trong một lân cận nhỏ, còn GTLN là giá trị lớn nhất trên toàn bộ tập xác định đang xét.' }
    ]
  },
  'Bài 11: Tích phân': {
    title: 'Tích phân xác định và phương pháp tính',
    briefing: 'Tích phân là giới hạn của tổng Riemann, dùng để tính diện tích, thể tích và các đại lượng biến thiên trong vật lý.',
    keyConcepts: [
      { term: 'Công thức Newton-Leibniz', definition: '$\int_a^b f(x)dx = F(b) - F(a)$, với $F(x)$ là một nguyên hàm của $f(x)$.' },
      { term: 'Đổi biến số', definition: 'Đặt $x = \phi(t)$ hoặc $u = u(x)$ để đưa về tích phân đơn giản hơn. Lưu ý phải đổi cận.' },
      { term: 'Tích phân từng phần', definition: '$\int_a^b u dv = [uv]_a^b - \int_a^b v du$. Thường dùng cho tích các hàm khác loại.' }
    ],
    mindmap: [
      { node: 'Tính chất', definition: 'Tuyến tính, cộng đoạn, bảo toàn thứ tự', children: ['$\int (f+g) = \int f + \int g$', '$\int_a^b = \int_a^c + \int_c^b$', 'Đổi cận đổi dấu'] },
      { node: 'Kỹ thuật tính', children: ['Sử dụng bảng nguyên hàm', 'Phương pháp đổi biến (Loại 1 & 2)', 'Phương pháp từng phần (Nhất lô, nhì đa, tam lượng, tứ mũ)'] },
      { node: 'Ứng dụng', children: ['Tính diện tích hình phẳng', 'Tính thể tích khối tròn xoay', 'Quãng đường, vận tốc trong vật lý'] }
    ],
    qa: [
      { question: 'Khi nào kết quả tích phân bằng 0?', answer: 'Khi hai cận bằng nhau ($a=b$) hoặc hàm số lẻ tích phân trên đoạn đối xứng $[-a, a]$.' },
      { question: 'Lưu ý quan trọng nhất khi đổi biến?', answer: 'Phải thực hiện bước ĐỔI CẬN ngay sau khi đặt biến mới.' }
    ]
  },
  'Bài 7: Dao động điều hòa': {
    title: 'Dao động điều hòa - Cơ sở của sóng và âm',
    briefing: 'Nghiên cứu chuyển động của vật quanh vị trí cân bằng với gia tốc tỉ lệ thuận và ngược chiều với li độ.',
    keyConcepts: [
      { term: 'Phương trình li độ', definition: '$x = A\cos(\omega t + \phi)$. Trong đó $A$ là biên độ, $\omega$ là tần số góc, $\phi$ là pha ban đầu.' },
      { term: 'Mối liên hệ $x, v, a$', definition: '$v$ sớm pha $\pi/2$ so với $x$; $a$ sớm pha $\pi/2$ so với $v$ (ngược pha với $x$).' },
      { term: 'Hệ thức độc lập', definition: '$A^2 = x^2 + \frac{v^2}{\omega^2} = \frac{a^2}{\omega^4} + \frac{v^2}{\omega^2}$.' }
    ],
    mindmap: [
      { node: 'Đại lượng động học', children: ['Li độ $x$', 'Vận tốc $v = -\omega A\sin(\omega t + \phi)$', 'Gia tốc $a = -\omega^2 x$'] },
      { node: 'Đại lượng chu kỳ', children: ['Chu kỳ $T = 2\pi/\omega$', 'Tần số $f = 1/T = \omega/2\pi$'] },
      { node: 'Năng lượng', children: ['Thế năng $W_t = \frac{1}{2}m\omega^2x^2$', 'Động năng $W_d = \frac{1}{2}mv^2$', 'Cơ năng $W = W_t + W_d = \frac{1}{2}m\omega^2A^2$ (Bảo toàn)'] },
      { node: 'Vòng tròn lượng giác', children: ['Xác định trạng thái dao động', 'Tính thời gian ngắn nhất', 'Quãng đường lớn nhất/nhỏ nhất'] }
    ],
    qa: [
      { question: 'Tại sao gia tốc luôn hướng về vị trí cân bằng?', answer: 'Vì $a = -\omega^2 x$, dấu trừ cho thấy vector gia tốc luôn ngược hướng với vector li độ (hướng về gốc tọa độ).' },
      { question: 'Cơ năng thay đổi thế nào khi biên độ tăng gấp đôi?', answer: 'Cơ năng tỉ lệ với bình phương biên độ ($A^2$), nên cơ năng sẽ tăng gấp 4 lần.' }
    ]
  },
  'Bài 1: Vật lí nhiệt': {
    title: 'Vật lí nhiệt - Nội năng và Định luật Nhiệt động lực học',
    briefing: 'Tìm hiểu về cấu trúc phân tử của chất, nhiệt độ và sự chuyển hóa năng lượng dưới dạng nhiệt và công.',
    keyConcepts: [
      { term: 'Nội năng', definition: 'Tổng động năng và thế năng của các phân tử cấu tạo nên vật. Phụ thuộc vào nhiệt độ và thể tích.' },
      { term: 'Định luật 1 NĐLH', definition: '$\Delta U = Q + A$. Độ biến thiên nội năng bằng tổng nhiệt lượng và công mà vật nhận được.' },
      { term: 'Nguyên lý 2 NĐLH', definition: 'Nhiệt không thể tự truyền từ vật lạnh sang vật nóng hơn. Hiệu suất động cơ nhiệt luôn $< 1$.' }
    ],
    mindmap: [
      { node: 'Mô hình động học phân tử', children: ['Các chất cấu tạo từ phân tử', 'Chuyển động hỗn loạn không ngừng', 'Lực tương tác phân tử'] },
      { node: 'Sự chuyển thể', children: ['Nóng chảy - Đông đặc', 'Hóa hơi - Ngưng tụ', 'Nhiệt nóng chảy riêng, nhiệt hóa hơi riêng'] },
      { node: 'Nhiệt độ', children: ['Thang Celsius ($^\circ C$)', 'Thang Kelvin ($K$): $T(K) = t(^\circ C) + 273,15$'] }
    ],
    qa: [
      { question: 'Làm thế nào để thay đổi nội năng của một vật?', answer: 'Có hai cách: Thực hiện công (cọ xát, nén khí) hoặc Truyền nhiệt (đốt nóng, tiếp xúc vật nóng).' },
      { question: 'Ý nghĩa của độ không tuyệt đối ($0 K$)?', answer: 'Là nhiệt độ thấp nhất lý thuyết, tại đó chuyển động nhiệt của các phân tử dừng lại.' }
    ]
  },
  'Este - Lipit': {
    title: 'Este và Lipit - Cấu tạo và Tính chất',
    briefing: 'Hợp chất hữu cơ quan trọng trong đời sống, là thành phần chính của chất béo và nhiều hương liệu thực phẩm.',
    keyConcepts: [
      { term: 'Este', definition: 'Sản phẩm của phản ứng este hóa giữa axit cacboxylic và ancol. Công thức chung đơn chức: $RCOOR\'$.' },
      { term: 'Phản ứng xà phòng hóa', definition: 'Thủy phân este trong môi trường kiềm (NaOH/KOH), tạo ra muối của axit và ancol. Phản ứng một chiều.' },
      { term: 'Lipit (Chất béo)', definition: 'Trieste của glixerol với các axit béo (axit đơn chức, mạch dài, không phân nhánh).' }
    ],
    mindmap: [
      { node: 'Este', children: ['Danh pháp: Tên gốc $R\'$ + tên gốc axit đuôi "at"', 'Tính chất vật lý: Ít tan trong nước, mùi thơm đặc trưng', 'Tính chất hóa học: Thủy phân (axit/kiềm), phản ứng ở gốc hiđrocacbon'] },
      { node: 'Chất béo', children: ['Axit béo no: Panmitic, Stearic', 'Axit béo không no: Oleic, Linoleic', 'Chỉ số axit, chỉ số xà phòng hóa'] },
      { node: 'Ứng dụng', children: ['Sản xuất xà phòng, chất tẩy rửa', 'Chế biến thực phẩm (bơ nhân tạo)', 'Sản xuất sơn, chất dẻo'] }
    ],
    qa: [
      { question: 'Tại sao este có nhiệt độ sôi thấp hơn ancol tương ứng?', answer: 'Vì giữa các phân tử este không tạo được liên kết hiđro như ancol.' },
      { question: 'Làm thế nào để chuyển hóa dầu thành mỡ?', answer: 'Dùng phản ứng hiđro hóa chất béo lỏng (không no) thành chất béo rắn (no) có xúc tác Ni, $t^\circ$.' }
    ]
  },
  'Vợ chồng A Phủ': {
    title: 'Vợ chồng A Phủ - Tô Hoài',
    briefing: 'Bản tình ca về sức sống tiềm tàng và khát vọng tự do của con người miền núi Tây Bắc dưới ách thống trị của phong kiến chúa đất.',
    keyConcepts: [
      { term: 'Nhân vật Mị', definition: 'Biểu tượng cho nỗi đau khổ và sức sống mãnh liệt. Từ "con rùa nuôi trong xó cửa" đến hành động cắt dây cởi trói cứu A Phủ.' },
      { term: 'Giá trị nhân đạo', definition: 'Cảm thông với số phận đau khổ, trân trọng vẻ đẹp tâm hồn và chỉ ra con đường giải phóng cho người lao động.' },
      { term: 'Giá trị hiện thực', definition: 'Phơi bày bộ mặt tàn ác của cha con thống lý Pá Tra và hủ tục cho vay nặng lãi, cúng trình ma.' }
    ],
    mindmap: [
      { node: 'Nhân vật Mị', children: ['Trước khi về làm dâu: Trẻ đẹp, hiếu thảo, yêu đời', 'Lúc mới về: Định tự tử bằng lá ngón', 'Sống lâu trong khổ cực: Tê liệt cảm giác, cam chịu', 'Đêm tình mùa xuân: Sức sống trỗi dậy (tiếng sáo)', 'Đêm đông cứu A Phủ: Hành động tự phát đến tự giác'] },
      { node: 'Nhân vật A Phủ', children: ['Số phận: Mồ côi, nghèo khó, gan góc', 'Nạn nhân của hủ tục: Trở thành nô lệ gạt nợ'] },
      { node: 'Nghệ thuật', children: ['Miêu tả tâm lý nhân vật tinh tế', 'Cách kể chuyện lôi cuốn', 'Ngôn ngữ đậm chất miền núi'] }
    ],
    qa: [
      { question: 'Chi tiết nào quan trọng nhất trong đêm tình mùa xuân?', answer: 'Tiếng sáo. Nó là biểu tượng của tình yêu, tự do, gọi Mị về với quá khứ tươi đẹp và đánh thức sức sống trong cô.' },
      { question: 'Tại sao Mị lại quyết định cứu A Phủ?', answer: 'Từ sự đồng cảm giữa những người cùng cảnh ngộ ("giọt nước mắt lấp lánh" của A Phủ) dẫn đến sự thức tỉnh của lương tâm và lòng tự trọng.' }
    ]
  }
};

export const HARDCODED_PLANS: Record<string, any> = {
  'Tích phân': {
    strategicGoals: [
      'Nắm vững 15 công thức nguyên hàm cơ bản và mở rộng',
      'Thành thạo kỹ thuật đổi biến số loại 1 và loại 2',
      'Giải quyết các bài toán thực tế về diện tích và thể tích'
    ],
    tasks: [
      { title: 'Hệ thống hóa bảng nguyên hàm', description: 'Viết lại và học thuộc bảng nguyên hàm các hàm đa thức, lượng giác, mũ, logarit. Làm 20 câu nhận biết.', category: 'lesson', sourceCitation: 'SGK Toán 12 - Trang 94', priority: 'High' },
      { title: 'Chuyên đề Đổi biến số', description: 'Luyện tập đặt $u$ cho các dạng: hàm ẩn trong căn, hàm lượng giác bậc cao, hàm mũ. Lưu ý bước đổi cận.', category: 'practice', sourceCitation: 'Tài liệu Chuyên đề Tích phân', priority: 'High' },
      { title: 'Kỹ thuật Từng phần', description: 'Thực hành quy tắc "Nhất lô, nhì đa..." cho các tích phân dạng $\int x \sin x, \int \ln x$. Giải 15 bài tập mẫu.', category: 'practice', sourceCitation: 'Sách bài tập Toán 12', priority: 'Medium' },
      { title: 'Ứng dụng Hình học', description: 'Tính diện tích hình phẳng giới hạn bởi 2 đồ thị và thể tích khối tròn xoay khi quay quanh trục Ox.', category: 'practice', sourceCitation: 'Đề thi minh họa Bộ GD', priority: 'High' },
      { title: 'Tổng hợp lỗi sai', description: 'Xem lại các lỗi: quên đổi cận, sai dấu khi lấy nguyên hàm $\cos$, thiếu hằng số $C$.', category: 'review', sourceCitation: 'Sổ tay toán học cá nhân', priority: 'Low' }
    ]
  },
  'Dao động điều hòa': {
    strategicGoals: [
      'Thuộc lòng các đại lượng đặc trưng và mối liên hệ pha',
      'Sử dụng vòng tròn lượng giác giải bài toán thời gian dưới 30s',
      'Master các bài toán năng lượng và con lắc lò xo'
    ],
    tasks: [
      { title: 'Lý thuyết trọng tâm', description: 'Học thuộc định nghĩa, phương trình $x, v, a$ và các hệ thức độc lập. Vẽ sơ đồ pha của 3 đại lượng.', category: 'lesson', sourceCitation: 'SGK Vật Lý 12 - Chương 1', priority: 'High' },
      { title: 'Kỹ thuật Vòng tròn lượng giác', description: 'Luyện tập xác định thời gian ngắn nhất đi từ $x_1$ đến $x_2$, quãng đường trong thời gian $t$. Làm 30 câu trắc nghiệm.', category: 'practice', sourceCitation: 'Cẩm nang giải nhanh Vật Lý', priority: 'High' },
      { title: 'Con lắc lò xo & Con lắc đơn', description: 'Tính chu kỳ, tần số, lực đàn hồi, lực hồi phục. Phân biệt các loại năng lượng.', category: 'practice', sourceCitation: 'Đề ôn tập chương 1', priority: 'Medium' },
      { title: 'Đồ thị dao động', description: 'Kỹ năng đọc đồ thị li độ - thời gian để xác định $A, T, \phi$. Giải 10 bài tập đồ thị mức độ vận dụng.', category: 'practice', sourceCitation: 'Tuyển tập đề thi THPTQG', priority: 'High' },
      { title: 'Bấm máy tính Casio', description: 'Sử dụng mode Complex để tổng hợp dao động và tìm các đại lượng chưa biết.', category: 'review', sourceCitation: 'Mẹo Casio Vật Lý', priority: 'Medium' }
    ]
  },
  'Khảo sát hàm số': {
    strategicGoals: [
      'Thành thạo quy trình khảo sát và vẽ đồ thị hàm số',
      'Nhận diện nhanh đồ thị và các hệ số $a, b, c, d$',
      'Giải quyết bài toán tương giao và tiếp tuyến'
    ],
    tasks: [
      { title: 'Quy trình chuẩn', description: 'Luyện tập 3 bước khảo sát cho hàm bậc 3, bậc 4 trùng phương và hàm nhất biến. Vẽ 5 đồ thị mẫu.', category: 'lesson', sourceCitation: 'SGK Toán 12 - Chương 1', priority: 'High' },
      { title: 'Nhận diện đồ thị', description: 'Học cách nhìn dáng điệu đồ thị để đoán dấu các hệ số và số điểm cực trị. Làm 40 câu trắc nghiệm nhận biết.', category: 'practice', sourceCitation: 'Ngân hàng câu hỏi Toán', priority: 'High' },
      { title: 'Bài toán Tiệm cận', description: 'Tìm tiệm cận đứng, ngang bằng định nghĩa và mẹo nhìn nhanh mẫu số/tử số.', category: 'practice', sourceCitation: 'Sách bài tập nâng cao', priority: 'Medium' },
      { title: 'Tương giao & Biện luận $m$', description: 'Dùng đồ thị để biện luận số nghiệm phương trình $f(x)=m$. Tìm $m$ để hàm số cắt trục hoành tại $k$ điểm.', category: 'practice', sourceCitation: 'Đề thi thử các trường chuyên', priority: 'High' }
    ]
  },
  'Este - Lipit': {
    strategicGoals: [
      'Nắm vững danh pháp và tính chất hóa học đặc trưng',
      'Giải thành thạo bài toán đốt cháy và xà phòng hóa',
      'Phân biệt các loại axit béo và chất béo'
    ],
    tasks: [
      { title: 'Danh pháp & Đồng phân', description: 'Viết đồng phân este của $C_2H_4O_2, C_3H_6O_2, C_4H_8O_2$. Gọi tên theo quy tắc gốc - chức.', category: 'lesson', sourceCitation: 'SGK Hóa 12 - Bài 1', priority: 'High' },
      { title: 'Phản ứng Thủy phân', description: 'Viết phương trình thủy phân trong môi trường axit và kiềm. Lưu ý các trường hợp este đặc biệt (vinyl, phenyl).', category: 'practice', sourceCitation: 'Vở ghi bài trên lớp', priority: 'High' },
      { title: 'Bài toán Đốt cháy', description: 'Sử dụng bảo toàn nguyên tố (C, H, O) và bảo toàn khối lượng để giải bài tập este no, đơn chức.', category: 'practice', sourceCitation: 'Chuyên đề Hóa hữu cơ', priority: 'Medium' },
      { title: 'Chất béo & Xà phòng', description: 'Học thuộc 4 axit béo quan trọng. Tính khối lượng xà phòng thu được từ phản ứng thủy phân triglixerit.', category: 'practice', sourceCitation: 'Đề kiểm tra 15p mẫu', priority: 'Medium' }
    ]
  },
  'Vợ chồng A Phủ': {
    strategicGoals: [
      'Phân tích sâu diễn biến tâm lý nhân vật Mị',
      'Hiểu rõ giá trị hiện thực và nhân đạo của tác phẩm',
      'Rèn luyện kỹ năng viết đoạn văn nghị luận văn học'
    ],
    tasks: [
      { title: 'Đọc hiểu văn bản', description: 'Đọc kỹ tác phẩm, gạch chân các chi tiết miêu tả thiên nhiên Tây Bắc và hủ tục phong kiến.', category: 'lesson', sourceCitation: 'SGK Ngữ Văn 12 - Tập 2', priority: 'High' },
      { title: 'Phân tích nhân vật Mị', description: 'Lập dàn ý chi tiết cho 3 giai đoạn: Trước khi làm dâu, Đêm tình mùa xuân, Đêm đông cứu A Phủ.', category: 'practice', sourceCitation: 'Sách hướng dẫn học Văn', priority: 'High' },
      { title: 'Giá trị nghệ thuật', description: 'Tìm hiểu cách Tô Hoài miêu tả phong tục, sử dụng ngôn ngữ và trần thuật. Viết đoạn văn 200 chữ về tiếng sáo.', category: 'practice', sourceCitation: 'Tài liệu bồi dưỡng HSG', priority: 'Medium' },
      { title: 'Luyện đề thi thử', description: 'Viết bài văn hoàn chỉnh phân tích sức sống tiềm tàng của Mị trong đêm tình mùa xuân.', category: 'practice', sourceCitation: 'Bộ đề thi THPTQG các năm', priority: 'High' }
    ]
  }
};

export const DEFAULT_SUMMARY = {
  title: 'Chủ đề học tập',
  briefing: 'Nội dung tóm tắt đang được cập nhật cho bài học này. AI đang hệ thống lại kiến thức chuẩn dựa trên chương trình giáo dục phổ thông mới.',
  keyConcepts: [
    { term: 'Khái niệm nền tảng', definition: 'Định nghĩa chi tiết về nội dung cốt lõi của bài học, giúp học sinh nắm vững bản chất vấn đề.' },
    { term: 'Nguyên lý vận dụng', definition: 'Cách thức áp dụng lý thuyết vào việc giải quyết các dạng bài tập thực tế và nâng cao.' },
    { term: 'Lưu ý quan trọng', definition: 'Các điểm dễ nhầm lẫn hoặc các mẹo nhỏ giúp tối ưu hóa quá trình làm bài và ghi nhớ kiến thức.' }
  ],
  mindmap: [
    { node: 'Phần 1: Hệ thống lý thuyết', children: ['Định nghĩa và khái niệm cơ bản', 'Các định lý và hệ quả quan trọng', 'Mối liên hệ với các bài học trước'] },
    { node: 'Phần 2: Phương pháp giải toán', children: ['Nhận diện các dạng bài tập phổ biến', 'Quy trình giải chi tiết từng bước', 'Các kỹ thuật tính nhanh bằng máy tính Casio'] },
    { node: 'Phần 3: Mở rộng kiến thức', children: ['Ứng dụng vào các hiện tượng thực tiễn', 'Các câu hỏi mang tính tư duy sáng tạo', 'Tổng hợp các lỗi sai thường gặp cần tránh'] }
  ],
  qa: [
    { question: 'Làm thế nào để ghi nhớ kiến thức bài này lâu nhất?', answer: 'Nên kết hợp việc đọc hiểu lý thuyết với việc vẽ sơ đồ tư duy cá nhân và làm ít nhất 10 bài tập vận dụng ngay sau khi học.' },
    { question: 'Trọng tâm thi cử của bài này nằm ở đâu?', answer: 'Thường xuất hiện trong các câu hỏi thông hiểu và vận dụng thấp. Cần chú ý kỹ các công thức biến đổi cơ bản.' }
  ]
};

export const DEFAULT_PLAN = {
  strategicGoals: [
    'Xây dựng nền tảng kiến thức vững chắc cho chủ đề này',
    'Hoàn thành đầy đủ các dạng bài tập từ cơ bản đến nâng cao',
    'Tối ưu hóa thời gian làm bài và hạn chế tối đa sai sót'
  ],
  tasks: [
    { title: 'Nghiên cứu lý thuyết sâu', description: 'Đọc kỹ nội dung sách giáo khoa, kết hợp xem video bài giảng để hiểu rõ bản chất các định nghĩa.', category: 'lesson', sourceCitation: 'SGK & Bài giảng trực tuyến', priority: 'High' },
    { title: 'Luyện tập bài tập cơ bản', description: 'Hoàn thành 20 câu trắc nghiệm mức độ nhận biết và thông hiểu để củng cố công thức.', category: 'practice', sourceCitation: 'Sách bài tập chuẩn', priority: 'High' },
    { title: 'Thực hành vận dụng cao', description: 'Thử sức với các bài toán tích hợp hoặc bài toán thực tế để rèn luyện tư duy logic.', category: 'practice', sourceCitation: 'Đề thi thử các năm', priority: 'Medium' },
    { title: 'Tự kiểm tra và đánh giá', description: 'Làm bài kiểm tra ngắn 15 phút để tự đánh giá mức độ hiểu bài và tìm ra các lỗ hổng cần bù đắp.', category: 'review', sourceCitation: 'Ngân hàng đề thi AI', priority: 'Medium' },
    { title: 'Hệ thống hóa bằng Mindmap', description: 'Tự tay vẽ lại sơ đồ tư duy cho toàn bộ chủ đề để khắc sâu kiến thức vào trí nhớ dài hạn.', category: 'review', sourceCitation: 'Vở ghi cá nhân', priority: 'Low' }
  ]
};
