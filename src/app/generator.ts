// Automatic Nested Data Generator Script
// This script generates hierarchical data structures for testing and development

interface NestedDataNode {
  id: string;
  name: string;
  category: string;
  price?: number;
  quantity?: number;
  status?: string;
  description?: string;
  createdDate?: Date;
  lastModified?: Date;
  tags?: string[];
  metadata?: { [key: string]: any };
  children?: NestedDataNode[];
}

interface GeneratorConfig {
  maxDepth: number;
  maxChildrenPerNode: number;
  minChildrenPerNode: number;
  totalNodes?: number;
  includeProducts: boolean;
  includePricing: boolean;
  includeInventory: boolean;
  includeMetadata: boolean;
  customCategories?: string[];
  seed?: number;
}

class NestedDataGenerator {
  private config: GeneratorConfig;
  private nodeCounter: number = 0;
  private usedNames: Set<string> = new Set();

  // Sample data arrays for realistic generation
  private readonly categoryTemplates = {
    'E-Commerce': {
      categories: [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Beauty & Personal Care',
        'Health & Wellness',
        'Automotive',
        'Pet Supplies',
        'Office Products',
        'Tools & Hardware',
        'Grocery & Gourmet',
        'Baby & Kids',
        'Music & Movies',
        'Video Games',
        'Jewelry & Watches',
        'Shoes & Accessories',
        'Arts & Crafts',
        'Industrial & Scientific',
        'Travel & Luggage',
        'Party Supplies',
        'Kitchen & Dining',
        'Furniture & Decor',
        'Bedding & Bath',
        'Lighting & Electrical',
        'Outdoor & Patio',
        'Appliances',
        'Cell Phones & Accessories',
        'Computer & Tablets',
        'TV & Audio',
        'Photography',
        'Musical Instruments',
        'Collectibles & Fine Art',
        'Antiques',
        'Handmade',
        'Gift Cards',
        'Amazon Devices',
        'Smart Home',
        'Fashion Jewelry',
        'Luxury Beauty',
        'Premium Electronics',
        'Designer Clothing',
        'Organic Foods',
        'Fitness Equipment',
        'Camping & Hiking',
        'Water Sports',
        'Winter Sports',
        'Team Sports',
        'Individual Sports',
        'Gaming Accessories',
        'Computer Components',
        'Networking',
        'Software',
        'Security & Surveillance',
        'Medical Supplies',
        'Laboratory Equipment',
        'Educational Materials',
        'School Supplies',
        'Religious & Spiritual',
        'Wedding Supplies',
        'Halloween Costumes',
        'Christmas Decorations',
        'Garden Tools',
        'Seeds & Plants',
        'Lawn Care',
        'Pool & Spa',
        'Grilling & Outdoor Cooking',
        'Emergency Preparedness',
        'Storage & Organization',
        'Cleaning Supplies',
        'Laundry',
        'Personal Protection',
        'Work Safety',
        'Construction Materials',
        'Plumbing',
        'Electrical Supplies',
        'Paint & Supplies',
        'Flooring & Tiles',
        'Windows & Doors',
        'Heating & Cooling',
        'Generators & Power',
        'Hand Tools',
        'Power Tools',
        'Measuring & Testing',
        'Fasteners',
        'Adhesives & Sealants',
        'Abrasives',
        'Cutting Tools',
        'Safety Equipment',
        'Packaging Materials',
        'Shipping Supplies',
        'Office Furniture',
        'Filing & Storage',
        'Presentation Supplies',
        'Writing & Correction',
        'Paper & Notebooks',
        'Binders & Accessories',
        'Calendars & Planners',
        'Labels & Stickers',
        'Staplers & Punches',
        'Scissors & Trimmers',
        'Laminating & Binding',
        'Desk Accessories',
        'Chair Mats & Pads',
        'Computer Accessories',
      ],
      subcategories: {
        Electronics: [
          'Smartphones',
          'Laptops',
          'Tablets',
          'Audio',
          'Gaming',
          'Accessories',
        ],
        Clothing: [
          "Men's Clothing",
          "Women's Clothing",
          "Kids' Clothing",
          'Shoes',
          'Accessories',
        ],
        Books: [
          'Fiction',
          'Non-Fiction',
          'Technical',
          'Educational',
          'Comics',
          'Reference',
        ],
        'Home & Garden': [
          'Furniture',
          'Decor',
          'Kitchen',
          'Garden Tools',
          'Lighting',
        ],
        Sports: [
          'Fitness',
          'Outdoor',
          'Team Sports',
          'Water Sports',
          'Winter Sports',
        ],
        Toys: [
          'Educational',
          'Action Figures',
          'Board Games',
          'Electronic Toys',
          'Dolls',
        ],
        'Beauty & Personal Care': [
          'Skincare',
          'Makeup',
          'Hair Care',
          'Fragrances',
          'Personal Care',
        ],
        'Health & Wellness': [
          'Vitamins',
          'Supplements',
          'Medical Devices',
          'Fitness Trackers',
        ],
        Automotive: [
          'Car Parts',
          'Tools',
          'Accessories',
          'Tires',
          'Oil & Fluids',
        ],
        'Pet Supplies': [
          'Dog Supplies',
          'Cat Supplies',
          'Fish & Aquatics',
          'Bird Supplies',
        ],
        'Office Products': [
          'Supplies',
          'Furniture',
          'Electronics',
          'Storage',
          'Presentation',
        ],
        'Tools & Hardware': [
          'Hand Tools',
          'Power Tools',
          'Hardware',
          'Safety Equipment',
        ],
        'Grocery & Gourmet': [
          'Fresh Food',
          'Pantry',
          'Beverages',
          'Snacks',
          'Gourmet',
        ],
        'Baby & Kids': ['Baby Care', 'Toys', 'Clothing', 'Safety', 'Feeding'],
        'Music & Movies': ['CDs', 'Vinyl', 'DVDs', 'Blu-ray', 'Digital Media'],
        'Video Games': [
          'Console Games',
          'PC Games',
          'Accessories',
          'Gaming Chairs',
        ],
        'Jewelry & Watches': [
          'Fine Jewelry',
          'Fashion Jewelry',
          'Watches',
          'Accessories',
        ],
        'Shoes & Accessories': [
          'Athletic Shoes',
          'Dress Shoes',
          'Casual Shoes',
          'Bags',
        ],
        'Arts & Crafts': [
          'Painting',
          'Drawing',
          'Crafting',
          'Sewing',
          'Scrapbooking',
        ],
        'Industrial & Scientific': [
          'Lab Equipment',
          'Industrial Tools',
          'Safety',
          'Testing',
        ],
        // Add generic subcategories for other categories
        default: [
          'Category A',
          'Category B',
          'Category C',
          'Category D',
          'Category E',
        ],
      },
      products: {
        Smartphones: [
          'iPhone 15',
          'Samsung Galaxy S24',
          'Google Pixel 8',
          'OnePlus 12',
          'Xiaomi 14',
        ],
        Laptops: [
          'MacBook Pro',
          'Dell XPS',
          'ThinkPad X1',
          'HP Spectre',
          'Surface Laptop',
        ],
        Tablets: [
          'iPad Pro',
          'Galaxy Tab S9',
          'Surface Pro',
          'Fire HD',
          'Pixel Tablet',
        ],
        "Men's Clothing": [
          'T-Shirts',
          'Jeans',
          'Suits',
          'Casual Shirts',
          'Polo Shirts',
        ],
        "Women's Clothing": [
          'Dresses',
          'Blouses',
          'Skirts',
          'Pants',
          'Sweaters',
        ],
        Fiction: [
          'Mystery Novels',
          'Romance',
          'Sci-Fi',
          'Fantasy',
          'Thrillers',
        ],
      },
    },
    Organization: {
      categories: [
        'Sales',
        'Marketing',
        'Engineering',
        'HR',
        'Finance',
        'Operations',
      ],
      subcategories: {
        Sales: [
          'Inside Sales',
          'Field Sales',
          'Sales Operations',
          'Customer Success',
        ],
        Marketing: [
          'Digital Marketing',
          'Content Marketing',
          'Product Marketing',
          'Brand Marketing',
        ],
        Engineering: ['Frontend', 'Backend', 'DevOps', 'QA', 'Mobile', 'Data'],
        HR: [
          'Recruiting',
          'People Operations',
          'Learning & Development',
          'Compensation',
        ],
        Finance: ['Accounting', 'FP&A', 'Treasury', 'Tax', 'Audit'],
        Operations: ['IT', 'Facilities', 'Legal', 'Compliance', 'Security'],
      },
      products: {
        Frontend: [
          'React Apps',
          'Vue Components',
          'Angular Modules',
          'Web Components',
        ],
        Backend: [
          'API Services',
          'Microservices',
          'Databases',
          'Message Queues',
        ],
        'Digital Marketing': [
          'Social Campaigns',
          'Email Campaigns',
          'SEO Projects',
          'PPC Campaigns',
        ],
      },
    },
  };

  private readonly statuses = [
    'Active',
    'Inactive',
    'Pending',
    'In Stock',
    'Out of Stock',
    'Low Stock',
    'Discontinued',
  ];
  private readonly tags = [
    'new',
    'popular',
    'sale',
    'featured',
    'limited',
    'bestseller',
    'premium',
    'budget',
  ];

  constructor(config: GeneratorConfig) {
    this.config = { ...config };
    if (config.seed) {
      this.seedRandom(config.seed);
    }
  }

  // Simple seeded random number generator for consistent results
  private seedRandom(seed: number): void {
    let m = 0x80000000;
    let a = 1103515245;
    let c = 12345;
    let state = seed;

    Math.random = () => {
      state = (a * state + c) % m;
      return state / (m - 1);
    };
  }

  generateData(): NestedDataNode[] {
    this.nodeCounter = 0;
    this.usedNames.clear();

    const template = this.categoryTemplates['E-Commerce'];
    const rootNodes: NestedDataNode[] = [];

    const categoriesToUse = this.config.customCategories || template.categories;

    // Generate all categories or limit by totalNodes
    for (const category of categoriesToUse) {
      const rootNode = this.createNode(category, 'Category', 0);
      rootNode.children = this.generateChildren(
        rootNode,
        1,
        template,
        category,
      );
      rootNodes.push(rootNode);

      if (
        this.config.totalNodes &&
        this.nodeCounter >= this.config.totalNodes
      ) {
        break;
      }
    }

    return rootNodes;
  }

  private generateChildren(
    parent: NestedDataNode,
    currentDepth: number,
    template: any,
    categoryKey: string,
  ): NestedDataNode[] {
    if (currentDepth >= this.config.maxDepth) {
      return [];
    }

    const children: NestedDataNode[] = [];
    const childrenCount = this.randomInt(
      this.config.minChildrenPerNode,
      this.config.maxChildrenPerNode,
    );

    if (currentDepth === 1) {
      // Generate subcategories
      const subcategories =
        template.subcategories[categoryKey] ||
        template.subcategories['default'] ||
        [];
      const subcategoriesToUse = this.shuffleArray([...subcategories]).slice(
        0,
        childrenCount,
      );

      for (const subcategory of subcategoriesToUse) {
        const childNode = this.createNode(
          subcategory,
          'Subcategory',
          currentDepth,
        );
        childNode.children = this.generateChildren(
          childNode,
          currentDepth + 1,
          template,
          subcategory,
        );
        children.push(childNode);

        if (
          this.config.totalNodes &&
          this.nodeCounter >= this.config.totalNodes
        ) {
          break;
        }
      }
    } else if (currentDepth === 2 && this.config.includeProducts) {
      // Generate products
      const products =
        template.products[categoryKey] ||
        this.generateGenericProducts(categoryKey);
      const productsToUse = this.shuffleArray([...products]).slice(
        0,
        childrenCount,
      );

      for (const product of productsToUse) {
        const productName = this.ensureUniqueName(product);
        const childNode = this.createNode(productName, 'Product', currentDepth);

        // Add product-specific properties
        if (this.config.includePricing) {
          childNode.price = this.generatePrice(categoryKey);
        }

        if (this.config.includeInventory) {
          childNode.quantity = this.randomInt(0, 100);
          childNode.status = this.getInventoryStatus(childNode.quantity);
        }

        children.push(childNode);

        if (
          this.config.totalNodes &&
          this.nodeCounter >= this.config.totalNodes
        ) {
          break;
        }
      }
    }

    return children;
  }

  private createNode(
    name: string,
    category: string,
    level: number,
  ): NestedDataNode {
    this.nodeCounter++;

    const node: NestedDataNode = {
      id: `node_${this.nodeCounter}_${Date.now()}`,
      name: name,
      category: category,
      createdDate: this.randomDate(),
      lastModified: new Date(),
    };

    // Add status for all nodes
    node.status =
      category === 'Product'
        ? this.getRandomStatus(['Active', 'Inactive', 'Discontinued'])
        : this.getRandomStatus(['Active', 'Inactive']);

    // Add description
    node.description = this.generateDescription(name, category);

    // Add tags
    if (Math.random() > 0.5) {
      node.tags = this.shuffleArray([...this.tags]).slice(
        0,
        this.randomInt(1, 3),
      );
    }

    // Add metadata if enabled
    if (this.config.includeMetadata) {
      node.metadata = this.generateMetadata(category);
    }

    return node;
  }

  private generateGenericProducts(categoryKey: string): string[] {
    const baseProducts = [
      `${categoryKey} Item A`,
      `${categoryKey} Item B`,
      `${categoryKey} Item C`,
      `Premium ${categoryKey}`,
      `Budget ${categoryKey}`,
      `Standard ${categoryKey}`,
      `Professional ${categoryKey}`,
      `Consumer ${categoryKey}`,
      `Enterprise ${categoryKey}`,
    ];
    return baseProducts;
  }

  private generatePrice(categoryKey: string): number {
    const priceRanges: { [key: string]: [number, number] } = {
      Smartphones: [299, 1299],
      Laptops: [699, 2999],
      Tablets: [199, 1199],
      "Men's Clothing": [19, 199],
      "Women's Clothing": [25, 249],
      Fiction: [9.99, 29.99],
      default: [9.99, 199.99],
    };

    const range = priceRanges[categoryKey] || priceRanges['default'];
    return (
      Math.round((Math.random() * (range[1] - range[0]) + range[0]) * 100) / 100
    );
  }

  private getInventoryStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 15) return 'Low Stock';
    return 'In Stock';
  }

  private generateDescription(name: string, category: string): string {
    const descriptions = {
      Category: `${name} category containing various subcategories and products`,
      Subcategory: `${name} subcategory with related products and items`,
      Product: `High-quality ${name} with excellent features and reliability`,
    };
    return (
      descriptions[category as keyof typeof descriptions] || `${name} item`
    );
  }

  private generateMetadata(category: string): { [key: string]: any } {
    const metadata: { [key: string]: any } = {
      priority: this.randomInt(1, 10),
      version: `${this.randomInt(1, 5)}.${this.randomInt(0, 9)}.${this.randomInt(0, 9)}`,
      owner: this.getRandomOwner(),
    };

    if (category === 'Product') {
      metadata['sku'] = this.generateSKU();
      metadata['weight'] = Math.round(Math.random() * 10 * 100) / 100;
      metadata['dimensions'] = {
        length: Math.round(Math.random() * 50 * 100) / 100,
        width: Math.round(Math.random() * 30 * 100) / 100,
        height: Math.round(Math.random() * 20 * 100) / 100,
      };
    }

    return metadata;
  }

  private generateSKU(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getRandomOwner(): string {
    const owners = [
      'John Doe',
      'Jane Smith',
      'Bob Johnson',
      'Alice Brown',
      'Charlie Wilson',
    ];
    return owners[Math.floor(Math.random() * owners.length)];
  }

  private ensureUniqueName(baseName: string): string {
    let name = baseName;
    let counter = 1;

    while (this.usedNames.has(name)) {
      name = `${baseName} ${counter}`;
      counter++;
    }

    this.usedNames.add(name);
    return name;
  }

  private randomDate(): Date {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomStatus(statuses: string[]): string {
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Utility method to get statistics about generated data
  getStatistics(data: NestedDataNode[]): any {
    let totalNodes = 0;
    let totalCategories = 0;
    let totalSubcategories = 0;
    let totalProducts = 0;
    let maxDepth = 0;

    const traverse = (nodes: NestedDataNode[], depth: number = 0) => {
      maxDepth = Math.max(maxDepth, depth);

      for (const node of nodes) {
        totalNodes++;

        switch (node.category) {
          case 'Category':
            totalCategories++;
            break;
          case 'Subcategory':
            totalSubcategories++;
            break;
          case 'Product':
            totalProducts++;
            break;
        }

        if (node.children) {
          traverse(node.children, depth + 1);
        }
      }
    };

    traverse(data);

    return {
      totalNodes,
      totalCategories,
      totalSubcategories,
      totalProducts,
      maxDepth,
      generatedAt: new Date().toISOString(),
    };
  }
}

// Usage Examples and Factory Functions

// Example 1: Basic E-commerce data generation
function generateEcommerceData(): NestedDataNode[] {
  const generator = new NestedDataGenerator({
    maxDepth: 3,
    maxChildrenPerNode: 4,
    minChildrenPerNode: 2,
    totalNodes: 150, // Set a reasonable total for e-commerce
    includeProducts: true,
    includePricing: true,
    includeInventory: true,
    includeMetadata: true,
  });

  return generator.generateData();
}

// Example 2: Large dataset generation
function generateLargeDataset(totalNodes: number = 1000): NestedDataNode[] {
  const generator = new NestedDataGenerator({
    maxDepth: 4,
    maxChildrenPerNode: 6,
    minChildrenPerNode: 3,
    totalNodes: totalNodes,
    includeProducts: true,
    includePricing: true,
    includeInventory: true,
    includeMetadata: true,
    seed: 12345, // For consistent results
  });

  return generator.generateData();
}

// Function to generate data with 100 categories
function generate100Categories(): NestedDataNode[] {
  const generator = new NestedDataGenerator({
    maxDepth: 3,
    maxChildrenPerNode: 3,
    minChildrenPerNode: 1,
    totalNodes: 1000, // Large enough to include all 100 categories plus children
    includeProducts: true,
    includePricing: true,
    includeInventory: true,
    includeMetadata: true,
    seed: 12345, // For consistent results
  });

  return generator.generateData();
}

// Function to generate ONLY categories (no subcategories or products)
function generate100CategoriesOnly(): NestedDataNode[] {
  const generator = new NestedDataGenerator({
    maxDepth: 1, // Only root level
    maxChildrenPerNode: 0,
    minChildrenPerNode: 0,
    includeProducts: false,
    includePricing: false,
    includeInventory: false,
    includeMetadata: true,
  });

  return generator.generateData();
}

function generateMediumDataset(): NestedDataNode[] {
  const generator = new NestedDataGenerator({
    maxDepth: 3,
    maxChildrenPerNode: 5,
    minChildrenPerNode: 2,
    totalNodes: 200, // Medium dataset - 200 nodes total
    includeProducts: true,
    includePricing: true,
    includeInventory: true,
    includeMetadata: true,
  });

  return generator.generateData();
}

function generateHugeDataset(): NestedDataNode[] {
  const generator = new NestedDataGenerator({
    maxDepth: 4,
    maxChildrenPerNode: 8,
    minChildrenPerNode: 3,
    totalNodes: 5000, // Huge dataset - 5000 nodes total
    includeProducts: true,
    includePricing: true,
    includeInventory: true,
    includeMetadata: true,
    seed: 54321,
  });

  return generator.generateData();
}

// Example 3: Custom categories
function generateCustomData(): NestedDataNode[] {
  const generator = new NestedDataGenerator({
    maxDepth: 3,
    maxChildrenPerNode: 3,
    minChildrenPerNode: 2,
    customCategories: ['Technology', 'Healthcare', 'Education', 'Finance'],
    includeProducts: true,
    includePricing: true,
    includeInventory: false,
    includeMetadata: true,
  });

  return generator.generateData();
}

// Main execution function with different size examples
function main() {
  console.log('🚀 Nested Data Generator Examples\n');

  // Generate different sizes of data
  const mediumData = generateMediumDataset(); // ~200 nodes
  const ecommerceData = generateEcommerceData(); // ~100-300 nodes (varies)
  const largeData = generateLargeDataset(1000); // 1000 nodes
  const hugeData = generateHugeDataset(); // 5000 nodes

  // Create generator instance for statistics
  const generator = new NestedDataGenerator({
    maxDepth: 3,
    maxChildrenPerNode: 4,
    minChildrenPerNode: 2,
    includeProducts: true,
    includePricing: true,
    includeInventory: true,
    includeMetadata: true,
  });

  // Print statistics for different sizes
  console.log(
    '📊 Medium Dataset (200 nodes):',
    generator.getStatistics(mediumData),
  );
  console.log('📊 E-commerce Data:', generator.getStatistics(ecommerceData));
  console.log(
    '📊 Large Dataset (1000 nodes):',
    generator.getStatistics(largeData),
  );
  console.log(
    '📊 Huge Dataset (5000 nodes):',
    generator.getStatistics(hugeData),
  );

  // Export sample data (first few items for inspection)
  console.log('\n📋 Sample E-commerce Data Structure:');
  console.log(JSON.stringify(ecommerceData.slice(0, 1), null, 2));

  return {
    mediumData,
    ecommerceData,
    largeData,
    hugeData,
    generator,
  };
}

// Quick setup functions for different use cases
export function generateDataForTesting(
  nodeCount: number = 100,
): NestedDataNode[] {
  return generateLargeDataset(nodeCount);
}

export function generateDataForDemo(): NestedDataNode[] {
  return generateMediumDataset(); // Perfect size for demos
}

export function generateDataForPerformanceTesting(): NestedDataNode[] {
  return generateHugeDataset(); // Large dataset for performance tests
}

// Export for use in Angular application
export {
  NestedDataGenerator,
  generateEcommerceData,
  generateLargeDataset,
  generateMediumDataset,
  generateHugeDataset,
  generate100Categories,
  generate100CategoriesOnly,
  generateCustomData,
  main,
};
export type { NestedDataNode, GeneratorConfig };
