import ServiceBlock from './ServiceBlock'
import { initAutomationScene } from '../scenes/automationScene'
import { initConsultingScene } from '../scenes/consultingScene'
import { initDiscoveryScene }  from '../scenes/discoveryScene'
import styles from './Services.module.css'

const SERVICES = [
  {
    number:  '01',
    name:    'AI Automation',
    tag:     null,
    desc:    'We design and deploy end-to-end intelligent automation systems that eliminate repetitive work, reduce operational costs, and free your team to focus on what drives real value. From workflow orchestration to intelligent document processing, our automation solutions integrate seamlessly with your existing infrastructure.',
    bullets: [
      'Workflow & process automation',
      'Intelligent data extraction',
      'API orchestration & integration',
      'Predictive task scheduling',
    ],
    cta:       'Start Automating →',
    reversed:  false,
    initScene: initAutomationScene,
  },
  {
    number:  '02',
    name:    'AI Consulting',
    tag:     null,
    desc:    'Not every business knows where AI fits — and that is exactly where we come in. Our strategic consulting practice helps organisations identify high-value AI opportunities, build implementation roadmaps, and navigate the complexities of enterprise adoption. We translate technical possibility into measurable business impact.',
    bullets: [
      'AI readiness assessments',
      'Strategic roadmap development',
      'Vendor & model selection',
      'Change management & training',
    ],
    cta:       'Book a Consultation →',
    reversed:  true,
    initScene: initConsultingScene,
  },
  {
    number:  '03',
    name:    'AI Discovery',
    tag:     'GEO',
    desc:    'When someone asks ChatGPT, Perplexity, or Google\'s AI Overviews to recommend a business like yours — do you appear? Generative Engine Optimisation (GEO) is the discipline of making sure the answer is yes. We audit how AI models perceive and cite your brand, identify why competitors get recommended over you, and build the content authority and structured signals that make generative engines trust and recommend your business — consistently.',
    bullets: [
      'AI visibility & citation audit',
      'Generative engine recommendation tracking',
      'Prompt-aligned content strategy',
      'Knowledge graph & structured data signals',
      'Competitor GEO benchmarking',
    ],
    cta:       'Get Recommended →',
    reversed:  false,
    initScene: initDiscoveryScene,
  },
]

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <header className={styles.header}>
        <span className="eyebrow">What We Do</span>
        <h2 className="section-title">Our <em>Services</em></h2>
      </header>

      {SERVICES.map(s => (
        <ServiceBlock key={s.number} {...s} />
      ))}
    </section>
  )
}
