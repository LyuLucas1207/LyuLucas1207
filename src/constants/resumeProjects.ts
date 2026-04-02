import type { ProjectApiItem } from '@/types'

/** Same copy for zh/fr fallback when full translation omitted */
function t(en: string, zh: string, fr = en): ProjectApiItem['title'] {
  return { en, zh, fr }
}

function bullets(en: string[], zh: string[], fr?: string[]): ProjectApiItem['details'] {
  return { en, zh, fr: fr ?? en }
}

/**
 * Project portfolio aligned with `Resume_Master/main.tex` § Projects (order preserved).
 */
export const RESUME_PROJECTS: ProjectApiItem[] = [
  {
    id: 'nebulaforgex-nas-ecosystem',
    slug: 'nebulaforgex-nas-ecosystem',
    title: t(
      'NebulaForgeX: NAS Infrastructure Ecosystem',
      'NebulaForgeX：NAS 基础设施生态',
      'NebulaForgeX : écosystème d’infrastructure NAS',
    ),
    year: '2024 – Present',
    category: 'Platform',
    group: 'featured',
    featured: true,
    summary: t(
      'Unified NAS stack (NFX-Stack) and edge proxy layer (NFX-Edge): Dockerized databases, Kafka, Traefik, and SPA-ready Nginx with security hardening.',
      '面向 ASUSTOR 等 NAS 的统一资源栈（NFX-Stack）与边缘反向代理（NFX-Edge）：容器化数据库、Kafka、Traefik 与可安全上线的 SPA 网关。',
      'Stack NAS unifié (NFX-Stack) et couche edge (NFX-Edge) : bases sous Docker, Kafka, Traefik et Nginx prêt pour SPA, durci pour la prod.',
    ),
    impact: t(
      'End-to-end reference deployment for multi-site hosting on private infrastructure.',
      '在私有基础设施上完成从数据栈到多站点发布的端到端参考部署。',
      'Déploiement de référence bout en bout pour l’hébergement multi-sites sur infra privée.',
    ),
    role: t(
      'Architecture, Docker Compose layouts, Traefik/Nginx templates, and security baselines.',
      '架构设计、Compose 编排、Traefik/Nginx 模板与安全基线。',
      'Architecture, compositions Docker, gabarits Traefik/Nginx et socle sécurité.',
    ),
    stack: ['Docker', 'Traefik', 'Kafka', 'MySQL', 'PostgreSQL', 'Redis', 'Nginx'],
    accent: 'cosmic',
    repositoryUrl: 'https://github.com/NebulaForgeX/NFX-Stack',
    liveUrl: 'https://github.com/NebulaForgeX/NFX-Edge',
    challenge: t(
      'Operators needed one repeatable way to run data services, TLS termination, and static/SPA sites without ad-hoc scripts.',
      '运维需要一种可重复的方式运行数据服务、TLS 终止以及静态/SPA 站点，而不是零散脚本。',
      'Il fallait un mode répétable pour services de données, TLS et sites statiques/SPA sans scripts ad hoc.',
    ),
    outcome: t(
      'Delivered modular compose stacks, management UIs for each datastore, and Traefik-driven HTTPS with SPA fallbacks.',
      '交付模块化 compose、各数据服务的管理界面，以及 Traefik 驱动的 HTTPS 与 SPA 回退。',
      'Stacks compose modulaires, UIs d’admin par datastore, HTTPS Traefik avec fallback SPA.',
    ),
    details: bullets(
      [
        'NFX-Stack bundles MySQL, Postgres, Mongo, Redis, Kafka (KRaft), optional MinIO with isolated networks and volumes.',
        'NFX-Edge uses Traefik 3.x with Docker provider, HTTPS, BasicAuth dashboard, and ACME-ready workflows.',
        'Nginx templates add try_files for client routers, gzip, and cache policies tuned for hashed assets.',
      ],
      [
        'NFX-Stack 集成 MySQL、Postgres、Mongo、Redis、Kafka（KRaft）与可选 MinIO，网络与卷隔离。',
        'NFX-Edge 基于 Traefik 3.x、Docker provider、HTTPS、面板 BasicAuth 与 ACME 流程。',
        'Nginx 模板支持前端路由 try_files、Gzip 与面向带哈希静态资源的缓存策略。',
      ],
    ),
  },
  {
    id: 'nfx-vault',
    slug: 'nfx-vault',
    title: t('NFX-Vault: SSL Certificate Management', 'NFX-Vault：SSL 证书管理', 'NFX-Vault : gestion de certificats SSL'),
    year: '2024 – Present',
    category: 'Platform',
    group: 'systems',
    featured: false,
    summary: t(
      'FastAPI + React control plane for Let’s Encrypt lifecycle, Kafka-driven pipelines, and CLI workflows beside the web UI.',
      'FastAPI + React 控制面：Let’s Encrypt 生命周期、Kafka 流水线，以及可替代 Web 的 CLI 流程。',
      'Plan de contrôle FastAPI + React pour Let’s Encrypt, pipelines Kafka et flux CLI en complément du Web.',
    ),
    impact: t(
      'Centralized certificate monitoring, export, and renewal hooks integrated with NFX-Edge.',
      '集中化证书监控、导出与续期，并与 NFX-Edge 集成。',
      'Surveillance, export et renouvellement centralisés, intégrés à NFX-Edge.',
    ),
    role: t(
      'Full-stack implementation across TLS module, file/analysis services, schedulers, and Docker packaging.',
      '全栈实现 TLS 模块、文件/分析服务、调度与 Docker 打包。',
      'Implémentation TLS, services fichier/analyse, planificateurs et packaging Docker.',
    ),
    stack: ['FastAPI', 'React 19', 'Kafka', 'MySQL', 'Redis', 'OpenSSL', 'Docker'],
    accent: 'amber',
    repositoryUrl: 'https://github.com/NebulaForgeX/NFX-Vault',
    challenge: t(
      'Certificates had to be observable, exportable, and automatable across Websites vs APIs roots on NAS volumes.',
      '证书需要在 Websites/APIs 不同根目录可观测、可导出、可自动化。',
      'Les certificats devaient être observables/exportables sur volumes NAS (Sites vs APIs).',
    ),
    outcome: t(
      'Built REST + Kafka services with APScheduler checks, React console, and shell helpers using jq/OpenSSL.',
      '交付 REST + Kafka 服务、APScheduler 巡检、React 控制台与 jq/OpenSSL 脚本助手。',
      'Services REST + Kafka, contrôles planifiés, console React et scripts jq/OpenSSL.',
    ),
    details: bullets(
      [
        'ACME HTTP-01 storage, PEM parsing, SAN validation, and cron-friendly status scans.',
        'Pipeline service consumes apply/refresh/export events with poison-topic handling.',
        'Frontend: Router 7, TanStack Query, RHF + Zod, virtualized tables, sidebar navigation.',
      ],
      [
        'ACME HTTP-01 存储、PEM 解析、SAN 校验与适合 cron 的状态扫描。',
        'Pipeline 消费 apply/refresh/export 等事件并支持 poison topic。',
        '前端：Router 7、TanStack Query、RHF+Zod、虚拟列表与侧栏导航。',
      ],
    ),
  },
  {
    id: 'nfx-news',
    slug: 'nfx-news',
    title: t(
      'NFX-News: News Aggregation & AI (MCP)',
      'NFX-News：新闻聚合与 AI（MCP）',
      'NFX-News : agrégation d’actu et IA (MCP)',
    ),
    year: '2024 – Present',
    category: 'Platform',
    group: 'systems',
    featured: false,
    summary: t(
      'Microservices for crawling 11+ CN media sources, Fastify news APIs, FastAPI HTML reports, and FastMCP analytics tools.',
      '微服务：抓取 11+ 中文平台、Fastify 新闻 API、FastAPI HTML 报表与 FastMCP 分析工具。',
      'Microservices : crawl de 11+ médias CN, API Fastify, rapports FastAPI et outils FastMCP.',
    ),
    impact: t(
      'Keyword DSL, Kafka event bus, and MCP interface bring ops + AI clients onto the same data plane.',
      '关键词 DSL、Kafka 总线与 MCP 接口，让运维与 AI 客户端共享同一数据面。',
      'DSL de mots-clés, bus Kafka et MCP pour aligner ops et clients IA.',
    ),
    role: t(
      'End-to-end ownership from crawler reliability to DDD news service, reporting UI, and MCP tool surface.',
      '端到端负责：爬虫可靠性、DDD 新闻服务、报表界面与 MCP 工具面。',
      'Responsabilité bout-en-bout : crawler, service news DDD, reporting et surface MCP.',
    ),
    stack: ['Python', 'Fastify', 'FastAPI', 'PostgreSQL', 'Redis', 'Kafka', 'FastMCP', 'Drizzle'],
    accent: 'forest',
    repositoryUrl: 'https://github.com/NebulaForgeX/NFX-News',
    challenge: t(
      'Sources differ wildly in HTML; needed resilient fetchers, deduping, and operator-friendly controls.',
      '各站点 HTML 差异大，需要稳健抓取、去重与易用的运营控制。',
      'HTML hétérogène : fetchers robustes, dédup et contrôles ops.',
    ),
    outcome: t(
      'Shipped crawl_server with schedules + Kafka triggers, news_server with JWT + caching, and MCP tool packs for analytics.',
      '交付带调度与 Kafka 触发的 crawl_server、含 JWT 与缓存的 news_server，以及用于分析的 MCP 工具包。',
      'crawl_server planifié + Kafka, news_server JWT/cache, packs MCP analytics.',
    ),
    details: bullets(
      [
        'Push notifications across Email, Telegram, DingTalk, Feishu, WeWork, Bark, Ntfy via PushManager.',
        'News server modules (auth/news/source) with Fastify, Drizzle, Redis, Kafka, JWT.',
        'MCP exposes DataQuery, Analytics, Search, Config, and System tools with validation + MCPError handling.',
      ],
      [
        '通知系统覆盖邮件、Telegram、钉钉、飞书、企微、Bark、Ntfy 等渠道。',
        '新闻服务划分 auth/news/source，配套 Fastify、Drizzle、Redis、Kafka、JWT。',
        'MCP 暴露查询、分析、搜索、配置与系统工具，并含校验与 MCPError。',
      ],
    ),
  },
  {
    id: 'nfx-identity',
    slug: 'nfx-identity',
    title: t(
      'NFX-Identity: Auth & Identity Platform',
      'NFX-Identity：统一身份平台',
      'NFX-Identity : plateforme d’identité',
    ),
    year: '2024 – Present',
    category: 'Platform',
    group: 'systems',
    featured: false,
    summary: t(
      'Go 1.24 services combining Fiber APIs, gRPC bridges, Kafka pipelines, CQRS repositories, and IAM-style profiles.',
      'Go 1.24：Fiber API、gRPC 桥接、Kafka 流水线、CQRS 仓储与 IAM 式画像能力。',
      'Services Go 1.24 : Fiber, gRPC, Kafka, CQRS et profils façon IAM.',
    ),
    impact: t(
      'Single identity plane for internal consoles and edge apps with RBAC-ready permission lists.',
      '为内部控制台与边缘应用提供单一身份平面，并预留 RBAC 权限列表。',
      'Plan d’identité unique pour consoles internes et apps edge, listes de permissions RBAC.',
    ),
    role: t(
      'Service decomposition, security middleware (JWT/bcrypt), data layer with GORM/pgx/Redis, and observability hooks.',
      '服务拆分、安全中间件（JWT/bcrypt）、GORM/pgx/Redis 数据层与可观测性挂钩。',
      'Découpage services, sécurité JWT/bcrypt, persistance GORM/pgx/Redis, observabilité.',
    ),
    stack: ['Go', 'Fiber', 'gRPC', 'Kafka', 'PostgreSQL', 'Redis', 'Watermill', 'OpenTelemetry'],
    accent: 'rose',
    repositoryUrl: 'https://github.com/NebulaForgeX/NFX-Identity',
    challenge: t(
      'Had to separate external auth flows from admin permission introspection while sharing domain models.',
      '在共享领域模型的同时，区分对外认证流与管理端权限自省。',
      'Séparer flux d’auth externes et introspection admin tout en partageant le domaine.',
    ),
    outcome: t(
      'Auth, Permission, and Image services each expose API + connection + pipeline roles with Atlas migrations.',
      'Auth / Permission / Image 服务均提供 API、连接与流水线角色，并用 Atlas 迁移。',
      'Services Auth/Permission/Image avec rôles API/connexion/pipeline et migrations Atlas.',
    ),
    details: bullets(
      [
        'CQRS-style query interfaces vs write repositories for user and permission aggregates.',
        'Kafka topics for user lifecycle, profile enrichment, and poison queues.',
        'Taskfile automation, buf protos, Koanf configs, Zap logging, Redis rate limits.',
      ],
      [
        'CQRS：查询接口与写仓储拆分，覆盖用户与权限聚合。',
        'Kafka 主题承载用户生命周期、画像增强与死信队列。',
        'Taskfile、buf、Koanf、Zap 日志与 Redis 限流。',
      ],
    ),
  },
  {
    id: 'nfx-documentation',
    slug: 'nfx-documentation',
    title: t(
      'NFX-Documentation: Deployment Playbooks',
      'NFX-Documentation：部署与配置指南',
      'NFX-Documentation : guides de déploiement',
    ),
    year: '2024 – Present',
    category: 'Platform',
    group: 'systems',
    featured: false,
    summary: t(
      'Authoritative NebulaForgeX runbooks: stack ordering, network naming, security baselines, and bilingual how-tos.',
      'NebulaForgeX 权威运行手册：部署顺序、网络命名、安全基线与双语操作指南。',
      'Runbooks NebulaForgeX : ordre de déploiement, réseaux, sécurité, guides bilingues.',
    ),
    impact: t(
      'Reduced onboarding time for collaborators touching NAS + edge + vault layers.',
      '降低新成员在 NAS、边缘与证书层协作时的上手成本。',
      'Réduit le temps d’onboarding pour NAS + edge + vault.',
    ),
    role: t(
      'Documented dependency chains (.env patterns, topic naming, backup drills) across the ecosystem.',
      '梳理依赖链（.env 范式、Topic 命名、备份演练）并成文。',
      'Documentation des dépendances (.env, topics Kafka, drills de backup).',
    ),
    stack: ['Markdown', 'Docker', 'Traefik', 'Kafka'],
    accent: 'cosmic',
    repositoryUrl: 'https://github.com/NebulaForgeX/NFX-Documentation',
    challenge: t(
      'Every service had slightly different networking assumptions; needed a single narrative for safe rollout.',
      '各服务网络假设不一，需要统一叙事以安全上线。',
      'Hypothèses réseau hétérogènes : il fallait un récit unique pour rollouts sûrs.',
    ),
    outcome: t(
      'Published layered deployment guides (router → NAS → stack → edge → vault) plus maintenance checklists.',
      '发布分层部署指南（路由 → NAS → stack → edge → vault）与运维检查表。',
      'Guides stratifiés (routeur → NAS → stack → edge → vault) et checklists de maintenance.',
    ),
    details: bullets(
      [
        'Environment templates, path conventions (/volume1/Resources, /volume1/Certs, /volume1/Websites).',
        'Security chapter covering password policy, cert permissions, firewall expectations.',
        'Operational cadence for logs, backups, upgrades, and incident triage.',
      ],
      [
        '环境模板与路径约定（/volume1/Resources 等）。',
        '安全章节：密码策略、证书权限与防火墙预期。',
        '运维节奏：日志、备份、升级与故障排查。',
      ],
    ),
  },
  {
    id: 'nfx-storages',
    slug: 'nfx-storages',
    title: t('NFX-Storages: Distributed Object Storage', 'NFX-Storages：分布式对象存储', 'NFX-Storages : stockage objet distribué'),
    year: '2024 – Present',
    category: 'Platform',
    group: 'systems',
    featured: false,
    summary: t(
      'Rust + NebulaFX backend delivering S3-compatible APIs, IAM, policies, audit streams, KMS bridges, and erasure coding.',
      'Rust + NebulaFX 后端：S3 兼容 API、IAM、策略、审计流、KMS 桥接与纠删码。',
      'Backend Rust + NebulaFX : API S3, IAM, politiques, audit, KMS et erasure coding.',
    ),
    impact: t(
      'Brings enterprise storage primitives to homelab/cloud edges with a React operations console.',
      '在家庭实验室/边缘云场景提供企业级存储原语与 React 运维台。',
      'Primitives stockage « entreprise » pour homelab/edge avec console React.',
    ),
    role: t(
      'Full-stack contribution across storage daemon, IAM/sqlx schemas, notify/audit modules, and Vite dashboard.',
      '参与存储守护进程、IAM/sqlx 模式、notify/audit 模块与 Vite 控制台。',
      'Daemon de stockage, IAM/sqlx, modules notify/audit et dashboard Vite.',
    ),
    stack: ['Rust', 'Tokio', 'Axum', 'OpenTelemetry', 'React 19', 'PostgreSQL', 'S3 API'],
    accent: 'amber',
    repositoryUrl: 'https://github.com/NebulaForgeX/NFX-Storages',
    challenge: t(
      'Object storage requires careful IAM, encryption hooks, and observability without sacrificing throughput.',
      '对象存储需在吞吐与 IAM、加密挂钩、可观测性之间取得平衡。',
      'Stockage objet : IAM, chiffrement et observabilité sans sacrifier le débit.',
    ),
    outcome: t(
      'Delivered S3s-compatible paths, ecstore healing, Vault-backed KMS options, and OTLP metrics pipelines.',
      '交付 S3 兼容路径、ecstore 自愈、Vault 系 KMS 与 OTLP 指标管线。',
      'Chemins S3, healing ecstore, KMS Vault et métriques OTLP.',
    ),
    details: bullets(
      [
        'IAM + policy engine + STS-style flows persisted via sqlx/refinery.',
        'Notify/Audit fan-out to queues, topics, or lambdas for compliance hooks.',
        'Frontend: atomic design system, guarded routes, TanStack Query, i18next, dark mode.',
      ],
      [
        'IAM + 策略引擎 + STS 式流程，sqlx/refinery 持久化。',
        'Notify/Audit 扇出到队列、主题或 Lambda 以满足合规。',
        '前端：原子化设计、受保护路由、TanStack Query、i18next、暗色模式。',
      ],
    ),
  },
  {
    id: 'pure-scan-app',
    slug: 'pure-scan-app',
    title: t('Pure Scan App (Flutter)', 'Pure Scan（Flutter）', 'Pure Scan (Flutter)'),
    year: '2024',
    category: 'Product',
    group: 'experimental',
    featured: false,
    summary: t(
      'Cross-platform Flutter app for generating, styling, scanning, and sharing QR codes with MD3 theming.',
      '跨平台 Flutter：生成、美化、扫描与分享二维码，Material Design 3 主题。',
      'App Flutter multi-plateforme : QR codes MD3, scan et partage.',
    ),
    impact: t(
      'Polished customization (colors, modules, error correction) plus native share sheet flows.',
      '可深度定制（颜色、模块、纠错等级）并打通系统级分享。',
      'Personnalisation poussée + partage natif.',
    ),
    role: t(
      'Solo product engineering across UI, camera permissions, contacts integration, and asset export.',
      '独立负责 UI、相机权限、通讯录集成与图片导出。',
      'Produit solo : UI, permissions caméra, contacts et export d’images.',
    ),
    stack: ['Flutter', 'Dart', 'mobile_scanner', 'qr_flutter', 'share_plus'],
    accent: 'forest',
    repositoryUrl: 'https://github.com/LyuLucas1207/Pure_Scan',
    challenge: t(
      'Needed reliable camera + permission UX while keeping QR preview responsive across Android/iOS.',
      '在 Android/iOS 上兼顾相机权限体验与实时二维码预览性能。',
      'Caméra + permissions fiables et preview QR réactive sur Android/iOS.',
    ),
    outcome: t(
      'Shipped segmented editors, draggable result sheets, and screenshot-based sharing pipeline.',
      '交付分段编辑器、可拖拽结果页与基于截图的分享流程。',
      'Éditeurs segmentés, feuilles résultats draggables, partage via captures.',
    ),
    details: bullets(
      [
        'Supports text, URL auto-protocol, and VCARD 3.0 generation.',
        'Scanner recognizes URLs vs vCard payloads with modal actions.',
        'Theme uses Poppins + Material 3 color generation + system chrome styling.',
      ],
      [
        '支持文本、URL 自动补全协议与 VCARD 3.0 生成。',
        '扫描识别 URL 与 vCard，并以模态动作分流。',
        '主题：Poppins、Material 3 色板与系统栏样式。',
      ],
    ),
  },
  {
    id: 'hand-gesture-recognition',
    slug: 'hand-gesture-recognition',
    title: t(
      'Hand Gesture Recognition Model',
      '手势识别机器学习框架',
      'Reconnaissance de gestes (ML)',
    ),
    year: '2024',
    category: 'Experience',
    group: 'experimental',
    featured: false,
    summary: t(
      'Scikit-learn + PyTorch/TensorFlow pipelines with MediaPipe landmarks, custom dataset tooling, and evaluation harness.',
      'Scikit-learn 与 PyTorch/TensorFlow 流水线，结合 MediaPipe 关键点、自建数据集工具与评估框架。',
      'Pipelines scikit-learn + PyTorch/TF, landmarks MediaPipe, outils de dataset et évaluation.',
    ),
    impact: t(
      'Comparative study across KNN, RF, SVM, MLP, and CNN stacks on 36-class gesture space.',
      '在 36 类手势空间上对比 KNN、RF、SVM、MLP 与 CNN。',
      'Comparaison KNN, RF, SVM, MLP et CNN sur 36 classes.',
    ),
    role: t(
      'Built data capture UIs, preprocessing scalers, trainer CLI, and realtime OpenCV classifiers.',
      '搭建数据采集 UI、预处理缩放器、训练 CLI 与 OpenCV 实时分类器。',
      'UI de capture, scalers, CLI d’entraînement et classifieur OpenCV temps réel.',
    ),
    stack: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'MediaPipe', 'scikit-learn'],
    accent: 'rose',
    repositoryUrl: 'https://github.com/LyuLucas1207/Hand-Gesture-Recognition-Model',
    challenge: t(
      'Landmark noise and class imbalance required robust augmentation and metric reporting beyond accuracy.',
      '关键点噪声与类别不均衡需要更强增广与超越准确率的指标。',
      'Bruit des landmarks et déséquilibre : augmentation + métriques au-delà de l’accuracy.',
    ),
    outcome: t(
      'Delivered confusion matrices, cross-validation, and realtime overlay classifiers for demo sessions.',
      '交付混淆矩阵、交叉验证与用于演示的实时叠加分类器。',
      'Matrices de confusion, CV et classifieur overlay pour démos.',
    ),
    details: bullets(
      [
        'Dataset tooling captured 15 classes × 400 samples with OpenCV cropping.',
        'CNN trainers include augmentation, early stopping, and learning-rate schedules.',
        'CLI ModelTrainerBuilder configures scalers, pipelines, and export formats.',
      ],
      [
        '数据集工具：15 类 × 400 样本，OpenCV 裁剪。',
        'CNN 训练含增广、早停与学习率策略。',
        'CLI ModelTrainerBuilder 配置缩放器、流水线与导出格式。',
      ],
    ),
  },
  {
    id: 'java-spring-hrm',
    slug: 'java-spring-hrm',
    title: t('Java Spring Boot HRM Platform', 'Java Spring Boot 人力资源平台', 'Plateforme RH Spring Boot'),
    year: '2023',
    category: 'Product',
    group: 'experimental',
    featured: false,
    summary: t(
      'Team-built HRM system with Spring Security JWT, MySQL + Redis, and Kafka event consistency checks.',
      '课程团队项目：Spring Security JWT、MySQL + Redis，以及 Kafka 事件一致性校验。',
      'Projet d’équipe : JWT Spring Security, MySQL + Redis, cohérence événementielle Kafka.',
    ),
    impact: t(
      'Demonstrated enterprise Java patterns: RBAC, caching, and idempotent consumers.',
      '展示企业级 Java 模式：RBAC、缓存与幂等消费者。',
      'Patterns Java : RBAC, cache et consommateurs idempotents.',
    ),
    role: t(
      'Backend contributor focusing on security layer, data modeling, and Kafka integration.',
      '后端成员：安全层、数据建模与 Kafka 集成。',
      'Backend : sécurité, modèle de données et Kafka.',
    ),
    stack: ['Java', 'Spring Boot', 'Kafka', 'MySQL', 'Redis', 'Spring Security'],
    accent: 'amber',
    repositoryUrl: 'https://github.com/LyuLucas1207',
    challenge: t(
      'Distributed events risked drift between MySQL and Redis caches without reconciliation.',
      '分布式事件可能导致 MySQL 与 Redis 缓存漂移，需要核对机制。',
      'Risque de dérive MySQL/Redis sans réconciliation.',
    ),
    outcome: t(
      'Added scheduled reconciliation, AOP validation hooks, and KafkaTemplate publishers.',
      '增加定时核对、AOP 校验钩子与 KafkaTemplate 发布。',
      'Réconciliation planifiée, hooks AOP et publishers Kafka.',
    ),
    details: bullets(
      [
        'Spring MVC APIs with JPA/Hibernate entities for HR resources.',
        'Redis-backed sessions + @Cacheable hotspots for permissions.',
        '@KafkaListener consumers with idempotency + poison handling strategy.',
      ],
      [
        'Spring MVC + JPA/Hibernate 建模人力资源实体。',
        'Redis 会话与 @Cacheable 热点权限。',
        '@KafkaListener 消费者含幂等与毒消息策略。',
      ],
    ),
  },
  {
    id: 'java-audio-dsp',
    slug: 'java-audio-dsp',
    title: t(
      'Java Multithreaded Audio & DSP',
      'Java 多线程音频与数字信号处理',
      'Audio multithreadé & DSP en Java',
    ),
    year: '2023',
    category: 'Experience',
    group: 'experimental',
    featured: false,
    summary: t(
      'CPEN project combining thread pools, synchronized resources, DFT analysis, echo filters, and JavaFX visualization.',
      'CPEN 项目：线程池、同步资源、DFT 分析、回声滤波与 JavaFX 可视化。',
      'Projet CPEN : pools de threads, DFT, filtres écho et JavaFX.',
    ),
    impact: t(
      'Linked DSP theory to interactive waveform views for coursework demos.',
      '将 DSP 理论与可交互波形演示结合。',
      'Relie théorie DSP et visualisation interactive.',
    ),
    role: t(
      'Implemented DSP pipeline + GUI cues for realtime waveform feedback.',
      '实现 DSP 流水线与实时波形反馈界面。',
      'Pipeline DSP + GUI temps réel.',
    ),
    stack: ['Java', 'JavaFX', 'DFT', 'Multithreading'],
    accent: 'cosmic',
    repositoryUrl: 'https://github.com/LyuLucas1207',
    challenge: t(
      'Balancing UI responsiveness with CPU-heavy transforms required careful threading.',
      '在重计算变换与 UI 响应之间做线程划分。',
      'Threading pour ne pas bloquer l’UI pendant les transformées.',
    ),
    outcome: t(
      'Delivered synchronized audio graph updates with educational overlays for lab reviewers.',
      '交付同步音频曲线更新与便于批改的可视化叠加。',
      'Graphes audio synchronisés avec overlays pédagogiques.',
    ),
    details: bullets(
      [
        'Client/server architecture with worker pools for DSP tasks.',
        'Frequency-domain charts driven by DFT outputs.',
        'Echo + filtering experiments rendered in JavaFX canvas.',
      ],
      [
        '客户端/服务端架构，工作线程池承载 DSP。',
        '由 DFT 输出驱动的频域图。',
        '回声与滤波实验绘制在 JavaFX canvas。',
      ],
    ),
  },
  {
    id: 'fpga-basic-organ',
    slug: 'fpga-basic-organ',
    title: t('Basic Organ Synthesizer (FPGA)', '基础风琴合成器（FPGA）', 'Orgue de base (FPGA)'),
    year: '2024',
    category: 'Experience',
    group: 'experimental',
    featured: false,
    summary: t(
      'DE1-SoC Verilog organ: programmable clocks, tone generation, LED chaser, and I2S audio path.',
      'DE1-SoC Verilog 风琴：可编程时钟、音调生成、LED 跑灯与 I2S 音频链路。',
      'Orgue Verilog DE1-SoC : horloges, tons, LEDs et I2S.',
    ),
    impact: t(
      'Hands-on proof of clock-domain reasoning and audio interfacing on FPGA fabric.',
      '在 FPGA 上实践时钟域推理与音频接口。',
      'Preuve de raisonnement d’horloges + audio sur FPGA.',
    ),
    role: t(
      'RTL design for tone_organ, clock_divider, led_control + testbenches.',
      'RTL：tone_organ、clock_divider、led_control 与 testbench。',
      'RTL tone_organ, clock_divider, led_control + benchs.',
    ),
    stack: ['Verilog', 'SystemVerilog', 'ModelSim', 'I2S'],
    accent: 'forest',
    repositoryUrl: 'https://github.com/LyuLucas1207/BasicOrgan-Verilog',
    challenge: t(
      'Frequency accuracy demanded precise divider ratios from the board oscillator.',
      '频率准确度依赖板载振荡器的分频比计算。',
      'Précision des fréquences via ratios de division.',
    ),
    outcome: t(
      'Eight selectable musical notes with synchronized LED motion and clean audio output.',
      '八个可选音符，LED 运动与音频输出同步。',
      'Huit notes, LEDs synchronisées et audio propre.',
    ),
    details: bullets(
      [
        'tone_organ.sv maps switches to Hz targets (C5–C6 range).',
        'clock_divider.sv derives note clocks from master crystal.',
        'Simulation benches validate tone, divider, and LED sequencing.',
      ],
      [
        'tone_organ.sv 将拨码映射到目标频率（C5–C6）。',
        'clock_divider.sv 由主晶振推导音符时钟。',
        'Testbench 验证音调、分频与 LED 序列。',
      ],
    ),
  },
  {
    id: 'fpga-simple-ipod',
    slug: 'fpga-simple-ipod',
    title: t('Simple iPod Music Player (FPGA)', '简易 iPod 音乐播放器（FPGA）', 'Lecteur iPod simple (FPGA)'),
    year: '2024',
    category: 'Experience',
    group: 'experimental',
    featured: false,
    summary: t(
      'FSM-driven Flash/SDRAM reader with PS/2 keyboard transport controls and variable playback speed.',
      'FSM 驱动 Flash/SDRAM 读取，PS/2 键盘控制播放与变速。',
      'Lecture Flash/SDRAM par FSM, contrôles PS/2 et vitesse variable.',
    ),
    impact: t(
      'Demonstrated memory arbitration + audio path integration on constrained FPGA resources.',
      '在有限 FPGA 资源下完成存储仲裁与音频通路整合。',
      'Arbitrage mémoire + chemin audio sur ressources limitées.',
    ),
    role: t(
      'Developed read_flash_fsm, keyboard_control, addr_gen_data_process, ctrl_audio_speed modules.',
      '开发 read_flash_fsm、keyboard_control、addr_gen_data_process、ctrl_audio_speed 等模块。',
      'Modules read_flash_fsm, keyboard_control, addr_gen, ctrl_audio_speed.',
    ),
    stack: ['Verilog', 'SDRAM', 'PS/2', 'I2S'],
    accent: 'rose',
    repositoryUrl: 'https://github.com/LyuLucas1207/SimpleIpod-Verilog',
    challenge: t(
      'Bidirectional playback required careful address sequencing to avoid SDRAM hazards.',
      '双向播放需要谨慎的地址序列以避免 SDRAM 冒险。',
      'Lecture bidirectionnelle : séquence d’adresses sans hazard SDRAM.',
    ),
    outcome: t(
      'Working player with play/pause, seek, fast-forward, and speed scaling.',
      '实现播放/暂停、跳转、快进与速度调节。',
      'Lecture play/pause, seek, FF et réglage de vitesse.',
    ),
    details: bullets(
      [
        'Keyboard map covers play/pause, rewind, forward, fast modes, reset.',
        'Audio speed divider defaults ~44 kHz with acceleration/deceleration keys.',
        'Integrates SDRAM buffering + I2S output stage.',
      ],
      [
        '键盘映射覆盖播放/暂停、倒带、快进、快模式、复位。',
        '速度分频默认约 44 kHz，可用按键加减速。',
        '整合 SDRAM 缓冲与 I2S 输出级。',
      ],
    ),
  },
  {
    id: 'fpga-ipod-picoblaze',
    slug: 'fpga-ipod-picoblaze',
    title: t('iPod + PicoBlaze Oscilloscope (FPGA)', 'iPod + PicoBlaze 示波器（FPGA）', 'iPod + PicoBlaze (FPGA)'),
    year: '2024',
    category: 'Experience',
    group: 'experimental',
    featured: false,
    summary: t(
      'Extended music player with embedded PicoBlaze MCU controlling LCD scope channels and overlays.',
      '在音乐播放器基础上集成 PicoBlaze MCU，驱动 LCD 示波器通道与叠加显示。',
      'Extension avec MCU PicoBlaze pour scope LCD et overlays.',
    ),
    impact: t(
      'Showed how soft-core control can orchestrate analog-like visualization on digital fabric.',
      '展示软核如何在数字电路上编排类模拟可视化。',
      'Soft-core pour visualisations « analogiques » sur FPGA.',
    ),
    role: t(
      'Integrated ALU/IDU/stack/register files plus LCD wrapper for scope modes.',
      '集成 ALU/译码/栈/寄存器堆与 LCD 封装以支持示波模式。',
      'Intégration ALU/IDU/stack/registres + wrapper LCD.',
    ),
    stack: ['Verilog', 'PicoBlaze', 'LCD', 'I2S'],
    accent: 'amber',
    repositoryUrl: 'https://github.com/LyuLucas1207/SimpleIpodPacoblaze-Verilog',
    challenge: t(
      'Sharing buses between audio datapath and MCU peripherals without timing clashes.',
      '在音频数据通路与 MCU 外设之间共享总线且避免时序冲突。',
      'Partage de bus audio/MCU sans conflits de timing.',
    ),
    outcome: t(
      'Maintained original playback features while adding live waveform LCD modes.',
      '保留原有播放能力并新增实时波形 LCD 模式。',
      'Fonctions lecture d’origine + modes LCD onde temps réel.',
    ),
    details: bullets(
      [
        'pacoblaze core split across ALU, IDU, stack, and register file.',
        'Wrapper exposes oscilloscope inputs + info slots for soft-core firmware.',
        'Firmware orchestrates LCD updates while audio DMA continues.',
      ],
      [
        'PicoBlaze 核心拆分 ALU、译码、栈与寄存器堆。',
        'Wrapper 暴露示波输入与信息槽供固件使用。',
        '固件驱动 LCD 更新同时保持音频 DMA。',
      ],
    ),
  },
  {
    id: 'fpga-rc4',
    slug: 'fpga-rc4',
    title: t('RC4 Cryptographic System (FPGA)', 'RC4 密码系统（FPGA）', 'Système RC4 (FPGA)'),
    year: '2024',
    category: 'Experience',
    group: 'experimental',
    featured: false,
    summary: t(
      'FSM pipeline for RC4 KSA/PRGA with bonus parallel key-search fabric and seven-segment readout.',
      'RC4 KSA/PRGA 的 FSM 流水线，含可选并行密钥搜索与数码管显示。',
      'Pipeline FSM RC4 KSA/PRGA + recherche de clé parallèle + 7-segments.',
    ),
    impact: t(
      'Hardware visualization of cipher stages for lab grading + extension credit.',
      '以硬件可视化密码阶段，满足实验评分与加分项。',
      'Visualisation matérielle des étapes de chiffrement.',
    ),
    role: t(
      'Authored task FSMs, integration shell, and parameterized parallel bonus core.',
      '编写各级任务 FSM、集成外壳与参数化并行加分核。',
      'FSM par tâche, intégration, cœur parallèle paramétrable.',
    ),
    stack: ['Verilog', 'FSM', 'SRAM', 'Seven-segment'],
    accent: 'forest',
    repositoryUrl: 'https://github.com/LyuLucas1207/Rc4Crypto-Verilog',
    challenge: t(
      'Multi-stage FSM handshakes had to stay glitch-free across integrated RAM ports.',
      '多阶段 FSM 握手在共享 RAM 端口上必须无毛刺。',
      'Poignées multi-FSM sans glitch sur ports RAM.',
    ),
    outcome: t(
      'Working encrypt/decrypt datapath plus integration testbench coverage for each stage.',
      '可用的加解密数据通路，以及覆盖各阶段的集成测试平台。',
      'Chemin chiffrement/déchiffrement + benches par étape.',
    ),
    details: bullets(
      [
        'Task1 initializes S array; Task2a performs KSA swaps; Task2b streams PRGA XOR.',
        'Task3 verifies decrypted payload and renders digits.',
        'Bonus TOTAL_CORES parameter stripes keyspace across parallel engines.',
      ],
      [
        'Task1 初始化 S 盒；Task2a 执行 KSA 交换；Task2b 输出 PRGA XOR。',
        'Task3 校验解密结果并驱动数码管。',
        '加分项 TOTAL_CORES 将密钥空间划分到并行引擎。',
      ],
    ),
  },
  {
    id: 'fpga-dds-nios',
    slug: 'fpga-dds-nios',
    title: t('DDS + Nios II Modulation (FPGA)', 'DDS + Nios II 调制系统（FPGA）', 'DDS + Nios II (FPGA)'),
    year: '2024',
    category: 'Experience',
    group: 'experimental',
    featured: false,
    summary: t(
      'DDS waveform tables + selectable ASK/FSK/BPSK/QPSK chains with Nios II soft-core control.',
      'DDS 波形表与可选 ASK/FSK/BPSK/QPSK 链路，并由 Nios II 软核控制。',
      'Tables DDS + chaînes ASK/FSK/BPSK/QPSK contrôlées par Nios II.',
    ),
    impact: t(
      'Bridged software-defined control with hardware modulators for communications lab.',
      '以软核软件控制桥接硬件调制器，服务通信实验。',
      'Contrôle soft-core + modulateurs matériels pour labo telecom.',
    ),
    role: t(
      'Built waveform_gen VHDL, selectors, LFSR sources, and clock-domain crossing bridges.',
      '编写 waveform_gen（VHDL）、调制选择器、LFSR 源与跨时钟域桥。',
      'VHDL waveform_gen, sélecteurs, LFSR, ponts CDC.',
    ),
    stack: ['VHDL', 'Verilog', 'Nios II', 'DDS', 'VGA'],
    accent: 'cosmic',
    repositoryUrl: 'https://github.com/LyuLucas1207/DdsNiosModulation-Verilog',
    challenge: t(
      'Mixing Nios firmware with high-speed DDS clocks demanded explicit CDC modules.',
      'Nios 固件与高速 DDS 时钟共存需要显式 CDC 模块。',
      'CDC explicites entre firmware Nios et horloges DDS.',
    ),
    outcome: t(
      'Demonstrated modulated carriers on VGA/Audio outputs with lab-ready testbenches.',
      '在 VGA/音频输出上演示调制载波，并提供实验用 testbench。',
      'Porteuses modulées sur VGA/audio + benches.',
    ),
    details: bullets(
      [
        'waveform_gen.vhd synthesizes sine/cos/saw lookup tables.',
        'DL_Selector supports ASK, FSK, BPSK, QPSK paths with LFSR excitation.',
        'Nios Qsys shell orchestrates register maps for mode selection.',
      ],
      [
        'waveform_gen.vhd 合成正弦/余弦/锯齿查表。',
        'DL_Selector 支持 ASK/FSK/BPSK/QPSK 与 LFSR 激励。',
        'Nios Qsys 负责模式寄存器与软件控制。',
      ],
    ),
  },
  {
    id: 'energy-recovery-dryer',
    slug: 'energy-recovery-dryer',
    title: t(
      'Energy Recovery Clothes Dryer',
      '能量回收衣物烘干机（Capstone）',
      'Sèche-linge à récupération d’énergie',
    ),
    year: '2023',
    category: 'Product',
    group: 'experimental',
    featured: false,
    summary: t(
      'Capstone hardware: rectified supplies, MOSFET motor/fan/heater control, DHT22 sensing, and Arduino HMI.',
      '毕业硬件：整流供电、MOSFET 电机/风扇/加热器控制、DHT22 传感与 Arduino 人机界面。',
      'Capstone : alim redressée, MOSFETs, DHT22, HMI Arduino.',
    ),
    impact: t(
      'Validated thermal + airflow targets (e.g., 75°C drum) with safety interlocks and presets.',
      '在联锁与预设下验证温度与气流指标（如内筒 75°C）。',
      'Validation thermique/flux avec verrouillages et préréglages.',
    ),
    role: t(
      'Firmware + circuit bring-up: PWM fan control, triac heater loop, LCD menu system.',
      '固件与电路调试：PWM 风扇、可控硅加热回路、LCD 菜单。',
      'Firmware : PWM ventilateur, triac, menus LCD.',
    ),
    stack: ['Arduino', 'C++', 'Power electronics', 'Sensors'],
    accent: 'rose',
    repositoryUrl: 'https://wiki.ubc.ca/Course:VANT151/2023/Capstone/APSC/Team2',
    liveUrl: 'https://wiki.ubc.ca/Course:VANT151/2023/Capstone/APSC/Team2',
    challenge: t(
      'Energy budget constrained heater/motor/fan coordination inside a 24V AC / 40VA envelope.',
      '在 24V AC / 40VA 预算内协调加热、电机与风扇。',
      'Coordination chauffage/moteur/ventilo dans enveloppe 24V AC / 40VA.',
    ),
    outcome: t(
      'Integrated drum + fan + heater loops with door interlocks, alarms, and LCD workflows.',
      '整合滚筒、风扇、加热回路，含门联锁、报警与 LCD 流程。',
      'Boucles tambour/ventilo/chauffe avec interlocks, alarmes et LCD.',
    ),
    details: bullets(
      [
        'Bridge rectifier + regulators feed Arduino, heater, and fan subsystems.',
        'Triac + snubber circuits guard heater switching; thermistor closes loop.',
        'UI uses four-button navigation with presets for humidity, temperature, fan, drum speed.',
      ],
      [
        '桥式整流与稳压为 Arduino、加热与风扇子系统供电。',
        '可控硅与缓冲电路保护加热切换；热敏电阻闭环。',
        '四键导航界面，预设湿度、温度、风速与滚筒转速。',
      ],
    ),
  },
]
