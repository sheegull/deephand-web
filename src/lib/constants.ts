import type { ServiceCard, ProcessStep, FeatureCard } from '@/types';

export const DATA_TYPES = [
  { value: 'image', label: { en: 'Image Data', ja: '画像データ' } },
  { value: 'video', label: { en: 'Video Data', ja: '動画データ' } },
  { value: 'text', label: { en: 'Text Data', ja: 'テキストデータ' } },
  { value: 'audio', label: { en: 'Audio Data', ja: '音声データ' } },
  { value: 'sensor', label: { en: 'Sensor Data', ja: 'センサーデータ' } },
  { value: 'other', label: { en: 'Other', ja: 'その他' } },
] as const;

export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'image-annotation',
    title: {
      en: 'Image Annotation',
      ja: '画像アノテーション',
    },
    description: {
      en: 'High-precision annotation for computer vision and robotics applications',
      ja: 'コンピュータビジョン・ロボティクス向け高精度画像アノテーション',
    },
    icon: 'Image',
    features: {
      en: ['Object Detection', 'Semantic Segmentation', 'Pose Estimation', 'OCR'],
      ja: ['物体検出', 'セマンティックセグメンテーション', '姿勢推定', 'OCR'],
    },
  },
  {
    id: 'video-labeling',
    title: {
      en: 'Video Labeling',
      ja: '動画ラベリング',
    },
    description: {
      en: 'Frame-by-frame video annotation for motion analysis and tracking',
      ja: 'モーション解析・追跡向けフレームバイフレーム動画アノテーション',
    },
    icon: 'Video',
    features: {
      en: ['Object Tracking', 'Action Recognition', 'Temporal Segmentation'],
      ja: ['物体追跡', '行動認識', '時系列セグメンテーション'],
    },
  },
  {
    id: 'sensor-data',
    title: {
      en: 'Sensor Data Processing',
      ja: 'センサーデータ処理',
    },
    description: {
      en: 'Structured annotation for IoT and robotics sensor data',
      ja: 'IoT・ロボティクス向けセンサーデータ構造化アノテーション',
    },
    icon: 'Activity',
    features: {
      en: ['Time Series Analysis', 'Anomaly Detection', 'Pattern Recognition'],
      ja: ['時系列解析', '異常検知', 'パターン認識'],
    },
  },
  {
    id: 'text-nlp',
    title: {
      en: 'Text & NLP',
      ja: 'テキスト・NLP',
    },
    description: {
      en: 'Natural language processing and text annotation services',
      ja: '自然言語処理・テキストアノテーションサービス',
    },
    icon: 'FileText',
    features: {
      en: ['Named Entity Recognition', 'Sentiment Analysis', 'Text Classification'],
      ja: ['固有表現抽出', '感情分析', 'テキスト分類'],
    },
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'step-1',
    step: 1,
    title: {
      en: 'Data Requirements Analysis',
      ja: 'データ要件分析',
    },
    description: {
      en: 'We analyze your data and annotation requirements to create an optimal strategy',
      ja: 'お客様のデータとアノテーション要件を分析し、最適な戦略を策定します',
    },
    icon: 'Search',
  },
  {
    id: 'step-2',
    step: 2,
    title: {
      en: 'Professional Annotation',
      ja: 'プロフェッショナルアノテーション',
    },
    description: {
      en: 'Expert annotators with AI/robotics domain knowledge perform high-quality labeling',
      ja: 'AI・ロボティクス領域の専門知識を持つアノテーターが高品質なラベリングを実施',
    },
    icon: 'Users',
  },
  {
    id: 'step-3',
    step: 3,
    title: {
      en: 'Quality Assurance & Delivery',
      ja: '品質保証・納品',
    },
    description: {
      en: 'Multi-stage quality checks ensure accuracy before secure delivery',
      ja: '多段階品質チェックで精度を確保し、セキュアに納品いたします',
    },
    icon: 'CheckCircle',
  },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'expertise',
    title: {
      en: 'AI/Robotics Expertise',
      ja: 'AI・ロボティクス専門性',
    },
    description: {
      en: 'Deep domain knowledge in artificial intelligence and robotics applications',
      ja: '人工知能・ロボティクス分野における深い専門知識',
    },
    icon: 'Brain',
  },
  {
    id: 'quality',
    title: {
      en: 'High Quality Standards',
      ja: '高品質基準',
    },
    description: {
      en: '99%+ accuracy with multi-stage quality control processes',
      ja: '多段階品質管理プロセスによる99%以上の精度',
    },
    icon: 'Award',
  },
  {
    id: 'scalability',
    title: {
      en: 'Scalable Solutions',
      ja: 'スケーラブルソリューション',
    },
    description: {
      en: 'From prototype to production-scale data annotation services',
      ja: 'プロトタイプから本格運用まで対応可能なデータアノテーション',
    },
    icon: 'TrendingUp',
  },
  {
    id: 'security',
    title: {
      en: 'Data Security',
      ja: 'データセキュリティ',
    },
    description: {
      en: 'Enterprise-grade security and confidentiality for your sensitive data',
      ja: '機密データに対するエンタープライズ級セキュリティと機密保持',
    },
    icon: 'Shield',
  },
];

export const SUPPORTED_LANGUAGES = ['en', 'ja'] as const;
export const DEFAULT_LANGUAGE = 'ja' as const;