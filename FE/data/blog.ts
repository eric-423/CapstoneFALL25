// Mock data cho blog posts và nội dung
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    tags: string[];
    author: {
        name: string;
        avatar: string;
        bio: string;
    };
    publishedAt: Date;
    readingTime: number; // minutes
    isFeature: boolean;
    isPinned: boolean;
    viewCount: number;
    likeCount: number;
}

export interface BlogCategory {
    id: string;
    name: string;
    description: string;
    slug: string;
    postCount: number;
}

export const blogCategories: BlogCategory[] = [
    {
        id: 'recipes',
        name: 'Công thức nấu ăn',
        description: 'Chia sẻ các công thức món ăn ngon và dễ làm tại nhà',
        slug: 'cong-thuc-nau-an',
        postCount: 15
    },
    {
        id: 'food-culture',
        name: 'Văn hóa ẩm thực',
        description: 'Khám phá văn hóa ẩm thực Việt Nam và thế giới',
        slug: 'van-hoa-am-thuc',
        postCount: 12
    },
    {
        id: 'health-nutrition',
        name: 'Sức khỏe & Dinh dưỡng',
        description: 'Thông tin về dinh dưỡng và lối sống lành mạnh',
        slug: 'suc-khoe-dinh-duong',
        postCount: 8
    },
    {
        id: 'restaurant-news',
        name: 'Tin tức nhà hàng',
        description: 'Cập nhật tin tức mới nhất từ nhà hàng',
        slug: 'tin-tuc-nha-hang',
        postCount: 10
    },
    {
        id: 'cooking-tips',
        name: 'Mẹo nấu ăn',
        description: 'Những mẹo hay trong việc nấu nướng',
        slug: 'meo-nau-an',
        postCount: 7
    }
];

export const blogPosts: BlogPost[] = [
    {
        id: 'cach-nau-pho-bo-chuan-vi',
        title: 'Cách nấu phở bò chuẩn vị như quán - Bí quyết từ đầu bếp chuyên nghiệp',
        slug: 'cach-nau-pho-bo-chuan-vi',
        excerpt: 'Khám phá bí quyết nấu một tô phở bò thơm ngon với nước dùng trong veo, đậm đà từ những nguyên liệu tươi ngon nhất.',
        content: `
Phở bò là món ăn quốc hồn quốc túy của người Việt Nam. Để có được một tô phở bò ngon, chuẩn vị, bạn cần chú ý đến từng công đoạn từ việc chọn nguyên liệu đến cách ninh nước dùng.

## Nguyên liệu cần chuẩn bị:

### Cho nước dùng:
- 1kg xương ống bò
- 500g xương sườn bò  
- 300g thịt bò nạm
- 1 củ hành tây
- 1 củ gừng (khoảng 100g)
- Gia vị: hồi, quế, thảo quả, đinh hương, hạt mùi

### Cho phần ăn kèm:
- Bánh phở tươi
- 200g thịt bò tái (thái mỏng)
- Hành lá, ngò gai
- Giá đỗ
- Chanh, ớt

## Cách thực hiện:

### Bước 1: Chuẩn bị xương và thịt
Rửa sạch xương bò, blanch trong nước sôi khoảng 5-7 phút để loại bỏ tạp chất. Vớt ra, rửa lại với nước lạnh.

### Bước 2: Nướng hành, gừng
Nướng hành tây và gừng trên bếp gas hoặc lò nướng cho đến khi thơm và hơi cháy ở một số chỗ.

### Bước 3: Rang gia vị
Rang nhẹ các loại gia vị như hồi, quế, thảo quả trong chảo khô cho thơm.

### Bước 4: Ninh nước dùng
Cho xương vào nồi nước lạnh, đun sôi rồi vớt bọt. Thêm hành, gừng đã nướng và gia vị đã rang. Ninh với lửa nhỏ trong 6-8 tiếng.

### Bước 5: Hoàn thiện
Nêm nếm nước dùng vừa ăn. Trụng bánh phở, cho vào tô cùng thịt tái, chan nước dùng nóng. Thêm hành lá, ngò gai và ăn kèm với giá đỗ, chanh, ớt.

Với công thức này, bạn sẽ có một tô phở bò thơm ngon, đậm đà như ở quán!
    `,
        coverImage: '/images/blog/pho-bo-recipe.jpg',
        category: 'recipes',
        tags: ['phở bò', 'công thức', 'nấu ăn', 'món việt'],
        author: {
            name: 'Chef Minh Anh',
            avatar: '/images/authors/chef-minh-anh.jpg',
            bio: 'Đầu bếp chuyên nghiệp với 15 năm kinh nghiệm trong lĩnh vực ẩm thực Việt Nam'
        },
        publishedAt: new Date('2024-09-20'),
        readingTime: 8,
        isFeature: true,
        isPinned: true,
        viewCount: 2547,
        likeCount: 189
    },
    {
        id: 'lich-su-mon-pho-viet-nam',
        title: 'Lịch sử và sự phát triển của món phở Việt Nam qua các thế kỷ',
        slug: 'lich-su-mon-pho-viet-nam',
        excerpt: 'Tìm hiểu về nguồn gốc và quá trình phát triển của món phở - biểu tượng ẩm thực Việt Nam được yêu thích trên toàn thế giới.',
        content: `
Phở là một trong những món ăn đặc trưng nhất của ẩm thực Việt Nam, đã trở thành biểu tượng văn hóa được biết đến rộng rãi trên toàn thế giới.

## Nguồn gốc của món phở

Món phở có nguồn gốc từ vùng Bắc Bộ Việt Nam vào đầu thế kỷ 20. Có nhiều giả thuyết về sự ra đời của món ăn này:

### Giả thuyết 1: Ảnh hưởng từ món pot-au-feu của Pháp
Một số nhà nghiên cứu cho rằng phở có thể được lấy cảm hứng từ món pot-au-feu của người Pháp, một món súp thịt bò với rau củ.

### Giả thuyết 2: Phát triển từ món ăn truyền thống
Giả thuyết khác cho rằng phở phát triển tự nhiên từ các món ăn truyền thống của Việt Nam như bún, miến.

## Sự phát triển qua các thời kỳ

### Thời kỳ đầu (1900-1920)
- Phở xuất hiện tại Hà Nội và Nam Định
- Chủ yếu là phở bò với nước dùng đơn giản
- Được bán bởi những người gánh phở rong

### Thời kỳ phát triển (1920-1954)
- Phở gà xuất hiện
- Công thức nước dùng được cải tiến
- Phở trở thành món ăn phổ biến ở các thành phố lớn

### Thời kỳ hiện đại (1954-nay)
- Phở lan rộng ra toàn quốc
- Xuất hiện nhiều biến thể: phở tái, phở chín, phở gà...
- Phở Việt Nam được biết đến trên toàn thế giới

Ngày nay, phở không chỉ là món ăn mà còn là niềm tự hào của người Việt Nam trên toàn thế giới.
    `,
        coverImage: '/images/blog/pho-history.jpg',
        category: 'food-culture',
        tags: ['phở', 'lịch sử', 'văn hóa', 'ẩm thực việt'],
        author: {
            name: 'PGS.TS Nguyễn Văn Đức',
            avatar: '/images/authors/nguyen-van-duc.jpg',
            bio: 'Nhà nghiên cứu văn hóa ẩm thực, Đại học Khoa học Xã hội và Nhân văn'
        },
        publishedAt: new Date('2024-09-18'),
        readingTime: 12,
        isFeature: true,
        isPinned: false,
        viewCount: 1823,
        likeCount: 156
    },
    {
        id: 'dinh-duong-trong-mon-pho',
        title: 'Giá trị dinh dưỡng trong tô phở và lợi ích sức khỏe',
        slug: 'dinh-duong-trong-mon-pho',
        excerpt: 'Phân tích giá trị dinh dưỡng của món phở và những lợi ích tích cực mà món ăn này mang lại cho sức khỏe.',
        content: `
Phở không chỉ ngon mà còn chứa nhiều giá trị dinh dưỡng tốt cho sức khỏe. Hãy cùng tìm hiểu về thành phần dinh dưỡng trong một tô phở.

## Thành phần dinh dưỡng chính

### Protein từ thịt bò
- Cung cấp amino acid thiết yếu
- Hỗ trợ xây dựng và phục hồi cơ bắp
- Tăng cường miễn dịch

### Carbohydrate từ bánh phở
- Cung cấp năng lượng cho cơ thể
- Dễ tiêu hóa và hấp thụ
- Không chứa gluten (nếu làm từ gạo)

### Vitamin và khoáng chất từ rau thơm
- Vitamin C từ rau thơm, giá đỗ
- Vitamin A từ cà rốt (nếu có)
- Folate và iron từ rau xanh

## Lợi ích sức khỏe

### 1. Hỗ trợ tiêu hóa
Nước dùng ấm giúp kích thích tiêu hóa và dễ hấp thủ dinh dưỡng.

### 2. Cung cấp nước cho cơ thể
Nước dùng giúp bổ sung nước và điện giải cần thiết.

### 3. Tăng cường miễn dịch
Các gia vị như gừng, hồi có tính kháng khuẩn tự nhiên.

### 4. Cân bằng dinh dưỡng
Một tô phở cung cấp đầy đủ 3 nhóm chất: đạm, bột, béo.

## Lưu ý khi ăn phở

- Nên ăn phở nóng để đảm bảo an toàn thực phẩm
- Không nên ăn quá nhiều do hàm lượng sodium cao
- Kết hợp với rau sống để tăng vitamin và chất xơ

Như vậy, phở không chỉ ngon mà còn rất tốt cho sức khỏe khi ăn đúng cách!
    `,
        coverImage: '/images/blog/pho-nutrition.jpg',
        category: 'health-nutrition',
        tags: ['dinh dưỡng', 'sức khỏe', 'phở', 'protein'],
        author: {
            name: 'BS. Lê Thị Hương',
            avatar: '/images/authors/bs-le-thi-huong.jpg',
            bio: 'Bác sĩ dinh dưỡng, chuyên gia tư vấn chế độ ăn uống lành mạnh'
        },
        publishedAt: new Date('2024-09-15'),
        readingTime: 6,
        isFeature: false,
        isPinned: false,
        viewCount: 1234,
        likeCount: 89
    },
    {
        id: 'meo-chon-nguyen-lieu-pho',
        title: '5 mẹo chọn nguyên liệu tươi ngon để nấu phở ngon như quán',
        slug: 'meo-chon-nguyen-lieu-pho',
        excerpt: 'Bí quyết chọn xương bò, thịt bò và các gia vị tươi ngon để có tô phở đúng chuẩn Hà Nội.',
        content: `
Để nấu được một tô phở ngon, việc chọn nguyên liệu tươi ngon là yếu tố then chốt quyết định hương vị món ăn.

## Mẹo 1: Chọn xương bò

### Xương ống
- Chọn xương to, còn tủy bên trong
- Màu trắng đục, không có mùi hôi
- Tủy xương còn chắc, không bị tan

### Xương sườn
- Chọn loại còn chút thịt bám
- Xương không bị nứt vỡ
- Màu sắc tự nhiên

## Mẹo 2: Chọn thịt bò

### Thịt nạm (để ninh nước dùng)
- Chọn phần thịt có gân, có một ít mỡ
- Màu đỏ tươi, không bị thâm
- Sờ vào có độ đàn hồi

### Thịt tái (để ăn sống)
- Chọn phần thăn lưng hoặc thăn ngoại
- Thịt phải tươi, mua trong ngày
- Thái mỏng, đều tay

## Mẹo 3: Chọn gia vị

### Hồi, quế, thảo quả
- Mua ở cửa hàng gia vị uy tín
- Còn mùi thơm đặc trưng
- Không bị ẩm mốc

### Gừng và hành tây
- Củ gừng già, vỏ mịn không nhăn
- Hành tây căng mọng, không mầm

## Mẹo 4: Chọn bánh phở

- Chọn bánh phở tươi trong ngày
- Sợi bánh trắng, không bị vỡ
- Mua đúng lượng cần dùng

## Mẹo 5: Chọn rau thơm

### Ngò gai
- Lá xanh tươi, không héo úa
- Có mùi thơm đặc trưng

### Hành lá
- Lá xanh non, không vàng
- Cắt gần gốc để giữ độ tươi

Với những mẹo trên, bạn sẽ chọn được nguyên liệu tốt nhất để nấu phở ngon tại nhà!
    `,
        coverImage: '/images/blog/pho-ingredients.jpg',
        category: 'cooking-tips',
        tags: ['mẹo nấu ăn', 'nguyên liệu', 'phở', 'chọn thực phẩm'],
        author: {
            name: 'Chị Nga - Bà chủ quán phở',
            avatar: '/images/authors/chi-nga.jpg',
            bio: '20 năm kinh nghiệm nấu phở, chủ quán phở nổi tiếng phố Cổ Hà Nội'
        },
        publishedAt: new Date('2024-09-12'),
        readingTime: 5,
        isFeature: false,
        isPinned: false,
        viewCount: 987,
        likeCount: 67
    },
    {
        id: 'khai-truong-chi-nhanh-moi',
        title: 'Khai trương chi nhánh mới tại Q7 - Ưu đãi 30% toàn menu',
        slug: 'khai-truong-chi-nhanh-moi',
        excerpt: 'Chúng tôi vui mừng thông báo khai trương chi nhánh mới tại Quận 7, TP.HCM với nhiều ưu đãi hấp dẫn.',
        content: `
Sau thành công tại chi nhánh đầu tiên, chúng tôi rất vui mừng thông báo khai trương chi nhánh mới tại Quận 7, TP.HCM.

## Thông tin chi nhánh mới

**Địa chỉ:** 123 Đường Nguyễn Thị Thập, Quận 7, TP.HCM
**Điện thoại:** 028 3456 7890
**Giờ mở cửa:** 6:00 - 22:00 (tất cả các ngày trong tuần)

## Đặc điểm chi nhánh mới

### Không gian rộng rãi
- Diện tích 200m2 với 80 chỗ ngồi
- Thiết kế hiện đại, ấm cúng
- Khu vực riêng cho gia đình

### Vị trí thuận lợi
- Gần khu dân cư Phú Mỹ Hưng
- Có bãi đậu xe rộng rãi
- Dễ dàng di chuyển bằng phương tiện công cộng

## Ưu đãi khai trương

### Tuần đầu tiên (20-27/09/2024)
- **Giảm 30%** toàn bộ menu
- **Tặng** 1 ly trà đá chanh cho mọi đơn hàng
- **Miễn phí** ship trong bán kính 3km

### Tặng kèm đặc biệt
- Voucher 50k cho lần đặt hàng tiếp theo
- Thẻ thành viên VIP với nhiều ưu đãi độc quyền
- Quà tặng cho 100 khách hàng đầu tiên

## Menu đặc biệt

Ngoài các món quen thuộc, chi nhánh mới sẽ có thêm:
- **Phở đặc biệt Sài Gòn** - phù hợp khẩu vị miền Nam
- **Bún bò Huế cay nồng** - đặc sản xứ Huế
- **Bánh mì chảo** - món mới độc đáo

## Đội ngũ phục vụ

- Đầu bếp giàu kinh nghiệm từ chi nhánh chính
- Nhân viên phục vụ được đào tạo chuyên nghiệp
- Cam kết chất lượng món ăn luôn đảm bảo

Chúng tôi rất mong được phục vụ quý khách tại chi nhánh mới!
    `,
        coverImage: '/images/blog/grand-opening.jpg',
        category: 'restaurant-news',
        tags: ['khai trương', 'chi nhánh mới', 'ưu đãi', 'quận 7'],
        author: {
            name: 'Ban Quản Lý',
            avatar: '/images/authors/management.jpg',
            bio: 'Đội ngũ quản lý nhà hàng TamTech Phở'
        },
        publishedAt: new Date('2024-09-20'),
        readingTime: 4,
        isFeature: true,
        isPinned: true,
        viewCount: 3456,
        likeCount: 234
    }
];

// Helper functions
export const getFeaturedPosts = (): BlogPost[] => {
    return blogPosts.filter(post => post.isFeature);
};

export const getPinnedPosts = (): BlogPost[] => {
    return blogPosts.filter(post => post.isPinned);
};

export const getPostsByCategory = (categoryId: string): BlogPost[] => {
    return blogPosts.filter(post => post.category === categoryId);
};

export const getRecentPosts = (limit: number = 5): BlogPost[] => {
    return blogPosts
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
        .slice(0, limit);
};

export const getPopularPosts = (limit: number = 5): BlogPost[] => {
    return blogPosts
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, limit);
};

export const searchPosts = (query: string): BlogPost[] => {
    const lowercaseQuery = query.toLowerCase();
    return blogPosts.filter(post =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
    return blogPosts.find(post => post.slug === slug);
};

export const getCategoryBySlug = (slug: string): BlogCategory | undefined => {
    return blogCategories.find(category => category.slug === slug);
};