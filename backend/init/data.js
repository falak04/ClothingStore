const users = [
  // {
  //   username: 'john_doe',
  //   email: 'john@example.com',
  //   password: 'hashedpassword1', // replace with actual hashed password in real app
  //   role: 'customer',
  // },
  // {
  //   username: 'jane_admin',
  //   email: 'jane@example.com',
  //   password: 'hashedpassword2',
  //   role: 'seller',
  // },
];


const products = [

  {
    name: "Silk Saree",
    price: 1499,
    description: "Elegant silk saree with traditional pattern",
    category: ["EthnicWear"],
    Gender: ["Female"],
    imageUrl: "https://images.unsplash.com/photo-1726600845193-fb25b7f4df52?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNpbGslMjBzYXJlZSUyMHJlZCUyMHdvbWFufGVufDB8fDB8fHww",
    size: ["M","L"],
    color: ["red","purple"],
    stock: 10,
    isFeatured: true
  },
  {
    name: "Anarkali Suit",
    price: 1299,
    description: "Anarkali suit adorned with embroidery",
    category: ["EthnicWear"],
    Gender: ["Female"],
    imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTIwCKEAwQ0uJK6yuMEKD0icPlyfHlqFrCffFQ17uFwGqmLGOlHQldsWriBD0GAk9WMbPeeSEg-ZJ9-5qs4NYtXsY7E_GdH6z739wgo_yGv",
    size: ["S","M","L","XL"],
    color: ["green","yellow"],
    stock: 8,
    isFeatured:false,
  },

  // Female Office Wear
  {
    name: "Formal Shirt",
    price: 799,
    description: "Crisp cotton formal shirt",
    category: ["OfficeWear"],
    Gender: ["Female"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRxIfzBvXh01M5eSi54DDSFWsPGw3Neapv-SKAwhLn6rW_hcTp59QSZNCbAx3kMGXOawWDThEge0NNo56ZW_E0dAUvftX6hYtLmy4kFvFNSQV5__MMbAnl4Ow",
    size: ["S","M","L","XL"],
    color: ["blue","white"],
    stock: 15,
    isFeatured:true,
  },
  {
    name: "Pencil Skirt",
    price: 899,
    description: "Black pencil skirt for office",
    category: ["OfficeWear"],
    Gender: ["Female"],
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR255HhroG6U6DacT8qxl-EsUXYZC8Dx2lNskGht-2UJsSyV-ih52eM8olmpR0u6j6LMeOeszpxv1LoAXfUkv5EwGhw_QCn-cSe5_STuv4",
    size: ["S","M","L"],
    color: ["blue","black"],
    stock: 12,
    isFeatured:false,
  },

  // Female Casual Wear
  {
    name: "Cotton T‑shirt",
    price: 499,
    description: "Comfortable daily cotton T‑shirt",
    category: ["CasualWear"],
    Gender: ["Female"],
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTjg6Vg1A8_VPjHYFojsai4T36X_BcxEMGRq6FXxtNMzVr4nAVWvNtAx0Z85Enobf9Qb4DNXXUOQ_n3JBFO5_IWFFabF5xomeqw0iMbsD4",
    size: ["XS","S","M","L"],
    color: ["yellow","green"],
    stock: 20,
    isFeatured:true,
  },
  {
    name: "Denim Jeans",
    price: 1099,
    description: "Stretch skinny denim jeans",
    category: ["CasualWear"],
    Gender: ["Female"],
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQOeryQVDxiab5WJcs6J2DAGsDdLJTE3aMpWvyMls7NVt5u4c0rTnkkzbIraqCb7vaUz8oc1iQbNqa3j3_SJFjXtD2QWMo5AWmEuwFj35RjjklN4my1PeqPjw&usqp=CAc",
    size: ["S","M","L","XL"],
    color: ["blue"],
    stock: 18,
    isFeatured:false,
  },

  // Female Western Wear
  {
    name: "One‑Piece Dress",
    price: 1399,
    description: "Floral print one‑piece dress",
    category: ["WesternWear"],
    Gender: ["Female"],
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR_f08V08Ss1DoNrgsLrZAo05D2ehVb6YiOFXR92Is2dFFg13aaywiNeCYtvyqvNfgDKV3bbfnAPO1dYCzOq59qZy4kqTP0iCtm0oQvGZSl8eYnPH1IFTO2Jg4S&usqp=CAc",
    size: ["S","M","L"],
    color: ["purple","red"],
    stock: 14,
    isFeatured:true,
  },
  {
    name: "Denim Jacket",
    price: 1599,
    description: "Classic blue denim jacket",
    category: ["WesternWear"],
    Gender: ["Female"],
    imageUrl: "https://image.hm.com/assets/hm/01/22/012296fb34bf6032135318932fc106e28236b54c.jpg?imwidth=1260",
    size: ["M","L","XL"],
    color: ["blue"],
    stock: 10,
    isFeatured:false,
  },

  // Male Ethnic Wear
  {
    name: "Kurta",
    price: 999,
    description: "Cotton kurta for festive wear",
    category: ["EthnicWear"],
    Gender: ["Male"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSGKaYHyyaw_2Ve9uR_vjmvyBzjJDlGI7bNTRlFsYNLPaIwsgg8wfBz6yO7kbjKPMO13bsqvqUt6hQDkC_qu55dOCsoEDr5QHwqTKbkQQrOw4XeYWFVQORSSiF0Nn0OC5vLtVAMPzTn&usqp=CAc",
    size: ["M","L","XL","XXL"],
    color: ["green","yellow"],
    stock: 16,
    isFeatured:true,
  },
  {
    name: "Sherwani",
    price: 3499,
    description: "Designer sherwani, wedding special",
    category: ["EthnicWear"],
    Gender: ["Male"],
    imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTJ9B9S86iHuOwh9KNH7mBDvTwEquPNNLdMMr7qCp0z0ybyDmfsI3STJUREQOosZj06yRMzHpJ7a9N-gpo6dGMajRkkiPdfOL4H39NkoS5vtaFG_3XwAVX5DA&usqp=CAc",
    size: ["L","XL","XXL"],
    color: ["red","purple"],
    stock: 5,
    isFeatured:false,
  },

  // Male Office Wear
  {
    name: "Formal Shirt",
    price: 699,
    description: "Slim fit formal shirt",
    category: ["OfficeWear"],
    Gender: ["Male"],
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQRlZRISe29k01bEiBGjDbKfPoAQQOOA_ah7Y99qLKRoQgRlqeEwWCu-cN-E18jlX_RbMCsO23qN_3vnIYqBZdNZJwDAFLzBmcj3dwGwhg8LXyFDzmhCvZmLtP08xsOOPDV0JgqFJt6WA&usqp=CAc",
    size: ["M","L","XL","XXL"],
    color: ["blue","white"],
    stock: 18,
    isFeatured:true,
  },
  {
    name: "Formal Trousers",
    price: 999,
    description: "Flat-front formal trousers",
    category: ["OfficeWear"],
    Gender: ["Male"],
    imageUrl: "https://image.hm.com/assets/hm/28/72/28720ad23ef464e31c6682aab3a2a344192d8106.jpg?imwidth=1260",
    size: ["M","L","XL","XXL"],
    color: ["black","blue"],
    stock: 15,
    isFeatured:false,
  },

  // Male Casual Wear
  {
    name: "Casual T‑shirt",
    price: 499,
    description: "Blue round-neck T‑shirt",
    category: ["CasualWear"],
    Gender: ["Male"],
    imageUrl: "https://image.hm.com/assets/hm/11/37/11370b7136b8f9745406230fb8ece7fa21c37529.jpg?imwidth=2160",
    size: ["S","M","L","XL"],
    color: ["yellow","green"],
    stock: 22,
    isFeatured:true,
  },
  {
    name: "Casual Jeans",
    price: 1199,
    description: "Comfort fit blue jeans",
    category: ["CasualWear"],
    Gender: ["Male"],
    imageUrl: "https://www.jockey.in/cdn/shop/products/UM45_INDGO_0103_S223_JKY_1_0fb1268a-8d40-4d36-b45f-7ca32121f615.webp?v=1700019161&width=560",
    size: ["M","L","XL","XXL"],
    color: ["blue"],
    stock: 17,
    isFeatured:false,
  },

  // Male Western Wear
  {
    name: "Denim Jacket",
    price: 1499,
    description: "Classic rugged denim jacket",
    category: ["WesternWear"],
    Gender: ["Male"],
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.lkmguzUB_JFRlktxgYGtQwHaJb?pid=Api&P=0&h=180",
    size: ["M","L","XL"],
    color: ["blue"],
    stock: 13,
    isFeatured:true,
  },
  {
    name: "Blazer",
    price: 2299,
    description: "Black formal blazer",
    category: ["WesternWear"],
    Gender: ["Male"],
    imageUrl: "https://image.hm.com/assets/hm/1d/87/1d87bcac62c89372bf3608783f3af379900b3275.jpg?imwidth=2160",
    size: ["L","XL","XXL"],
    color: ["black"],
    stock: 8,
    isFeatured:false,
  },

  // Kids Ethnic Wear
  {
    name: "Kids Kurta Pyjama",
    price: 799,
    description: "Cotton kurta pyjama set",
    category: ["EthnicWear"],
    Gender: ["Kids"],
    imageUrl: "https://cdn.fcglcdn.com/brainbees/images/products/583x720/20235885a.webp",
    size: ["S","M","L"],
    color: ["yellow","green"],
    stock: 12,
    isFeatured:true,
  },
  {
    name: "Kids Lehenga",
    price: 899,
    description: "Festive lehenga choli for girls",
    category: ["EthnicWear"],
    Gender: ["Kids"],
    imageUrl: "https://cdn.fcglcdn.com/brainbees/images/products/583x720/19784110a.webp",
    size: ["S","M","L"],
    color: ["red","purple"],
    stock: 10,
    isFeatured:false,
  },

  // Kids Office Wear
  {
    name: "Kids Formal Shirt",
    price: 499,
    description: "Formal shirt for school functions",
    category: ["OfficeWear"],
    Gender: ["Kids"],
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.SXXM7NjGojxvUBhqvf6CFAHaJC?pid=Api&P=0&h=180",
    size: ["S","M","L"],
    color: ["blue","white"],
    stock: 14,
    isFeatured:true,
  },
  {
    name: "Kids Formal Trousers",
    price: 599,
    description: "Formal trousers for kids",
    category: ["OfficeWear"],
    Gender: ["Kids"],
    imageUrl: "https://image.hm.com/assets/hm/cd/24/cd24771f41f26f238cf9682e7253ce7c366708f0.jpg?imwidth=2160",
    size: ["S","M","L"],
    color: ["black","blue"],
    stock: 9,
    isFeatured:false,
  },

  // Kids Casual Wear
  {
    name: "Kids T‑shirt",
    price: 299,
    description: "Fun print kids T‑shirt",
    category: ["CasualWear"],
    Gender: ["Kids"],
    imageUrl: "https://image.hm.com/assets/hm/d2/db/d2dba3cc35cba2142d3160b081c3dfe74bb427a9.jpg?imwidth=2160",
    size: ["XS","S","M"],
    color: ["yellow","green"],
    stock: 18,
    isFeatured:true,
  },
  {
    name: "Kids Jeans",
    price: 599,
    description: "Durable kids denim jeans",
    category: ["CasualWear"],
    Gender: ["Kids"],
    imageUrl: "https://cdn.fcglcdn.com/brainbees/images/products/583x720/20110505a.webp",
    size: ["S","M","L"],
    color: ["blue"],
    stock: 12,
    isFeatured:true,
  },

  // Kids Western Wear
  {
    name: "Kids Dress",
    price: 799,
    description: "Cute floral dress",
    category: ["WesternWear"],
    Gender: ["Kids"],
    imageUrl: "https://image.hm.com/assets/hm/b7/c5/b7c5830995b43b8fa1b7784716838a92f2410e03.jpg?imwidth=2160",
    size: ["S","M","L"],
    color: ["purple","red"],
    stock: 11,
    isFeatured:false,
  },
  {
    name: "Kids Jacket",
    price: 899,
    description: "Warm kids jacket",
    category: ["WesternWear"],
    Gender: ["Kids"],
    imageUrl: "https://cdn.fcglcdn.com/brainbees/images/products/583x720/17669300a.webp",
    size: ["S","M","L"],
    color: ["blue"],
    stock: 7,
    isFeatured:true,
  },

  // Extras
  {
    name: "Women's Blazer",
    price: 2299,
    description: "Stylish black blazer",
    category: ["WesternWear"],
    Gender: ["Female"],
    imageUrl: "https://image.hm.com/assets/hm/75/de/75de33186116344584bc5df00e5b1d7af4253413.jpg?imwidth=1260",
    size: ["M","L","XL"],
    color: ["black"],
    stock: 6,
    isFeatured:false,
  },
  {
    name: "Men's Polo Shirt",
    price: 699,
    description: "Casual polo shirt",
    category: ["CasualWear"],
    Gender: ["Male"],
    imageUrl: "https://www.jockey.in/cdn/shop/files/MV42_MVBLU_0103_S124_JKY_1.webp?v=1713237360&width=560",
    size: ["M","L","XL"],
    color: ["green","blue"],
    stock: 20,
    isFeatured:true,
  }
];
// Transform products to use variants array
const transformedProducts = products.map(product => {
  if (product.size && product.color && typeof product.stock !== 'undefined') {
    const variants = [];
    product.size.forEach(size => {
      product.color.forEach(color => {
        variants.push({ size, color, stock: product.stock });
      });
    });
    const { size, color, stock, ...rest } = product;
    return { ...rest, variants };
  }
  return product;
});
transformedProducts.forEach(product => {
  product.seller = '68766cb507ed97afeb1cb2b0';
});
module.exports = {
  products: transformedProducts
};