import { motion } from 'motion/react';
import { 
  Cpu, 
  ShieldCheck, 
  Rocket, 
  ArrowRight,
  CheckCircle2,
  Monitor,
  Calculator,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  X,
  Loader2
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { cn } from './lib/utils';

const PRICING = {
  its: {
    base: { name: 'Базовый', price: 2900, description: 'Доступ к обучающим материалам САПР' },
    standard: { name: 'Стандартный', price: 3500, description: 'П.1 + расширенный доступ к обучению' },
    expanded: { name: 'Расширенный', price: 5000, description: 'П.2 + консалтинг и SLA 8/5' },
  },
  infrastructure: {
    vps: 900,
    support: 5900
  }
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [workstations, setWorkstations] = useState(5);
  const [tier, setTier] = useState<keyof typeof PRICING.its>('base');
  const [months, setMonths] = useState(6);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const leadData = {
      fields: {
        TITLE: 'Заявка с сайта PropTech.Group (Калькулятор АРМП)',
        NAME: formData.name,
        PHONE: [{ VALUE: formData.phone, VALUE_TYPE: 'WORK' }],
        EMAIL: [{ VALUE: formData.email, VALUE_TYPE: 'WORK' }],
        COMMENTS: `Тариф: ${PRICING.its[tier].name}\nКоличество рабочих мест: ${workstations}\nСрок проекта: ${months} мес.\nСкидка: ${discount * 100}%\nИтоговая стоимость: ${total} руб.`
      }
    };

    try {
      // Для реальной работы подставьте свой webhook URL из Битрикс24
      // Разработчикам -> Другое -> Входящий вебхук
      const BITRIX_WEBHOOK_URL = import.meta.env.VITE_BITRIX_WEBHOOK_URL || '';
      
      if (BITRIX_WEBHOOK_URL) {
        await fetch(BITRIX_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });
      } else {
        // Имитация отправки для демо
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Sending to Bitrix24:', leadData);
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setFormData({ name: '', phone: '', email: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting:', error);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const itsCost = PRICING.its[tier].price * workstations;
    const infraCost = PRICING.infrastructure.vps + PRICING.infrastructure.support;
    
    let currentDiscount = 0;
    if (months === 3) currentDiscount = 0.05;
    else if (months === 6) currentDiscount = 0.10;
    else if (months === 12) currentDiscount = 0.15;
    
    setDiscount(currentDiscount);
    setTotal((itsCost + infraCost) * months * (1 - currentDiscount));
  }, [workstations, tier, months]);
  
  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-blue-500/20">P</div>
            <span className="font-display font-bold text-xl tracking-tight">Prop-Tech<span className="text-blue-500">.Group</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">Выгоды</a>
            <a href="#about" className="hover:text-white transition-colors">О решении</a>
            <a href="#calculator" className="hover:text-white transition-colors">Калькулятор</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://t.me/proptech_group" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              Telegram
            </a>
            <button className="bg-white text-slate-950 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2 group">
              Запись на пилот
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full -z-10" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-[1.2] space-y-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              АРМП — Автоматизированные рабочие места проектировщиков
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-display font-extrabold leading-[1.02] tracking-tighter"
            >
              Мощные станции <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-200">для САПР и BIM +AI</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Варианты реализации решений на аппаратной и облачной платформах с vGPU. Полная поддержка доступа к международным высокотехнологичным сервисам
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-5 pt-6 justify-center lg:justify-start"
            >
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/40 text-lg active:scale-95">
                Получить АРМП
              </button>
              <a href="#calculator" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg">
                <Calculator className="w-5 h-5" />
                Рассчитать стоимость
              </a>
            </motion.div>
          </div>

          <motion.div 
             initial={{ opacity: 0, rotate: 5, scale: 0.95 }}
             animate={{ opacity: 1, rotate: 0, scale: 1 }}
             transition={{ duration: 1, type: 'spring' }}
             className="flex-1 relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_-20px_rgba(37,99,235,0.3)] bg-slate-900/40 backdrop-blur-md p-8">
              <div className="aspect-square bg-slate-800 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                 <Monitor className="w-24 h-24 text-blue-500/20" />
                 
                 <div className="absolute top-8 right-8 bg-blue-600/30 backdrop-blur-xl px-5 py-3 rounded-2xl border border-blue-500/40 text-[11px] font-black tracking-widest text-blue-100 uppercase">
                    Hybrid BIM Cloud
                 </div>
                 
                 <div className="absolute bottom-8 left-8 right-8 space-y-4">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '82%' }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                      />
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-3xl font-display font-black text-white">82%</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Render Load Status</p>
                    </div>
                 </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/20 blur-[100px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/20 blur-[100px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Software Section */}
      <section className="py-20 border-y border-white/5 bg-slate-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-16">
            Поддерживаем профессиональное ПО для проектирования
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50">
            {['AutoCAD', 'Revit', '3ds Max', 'Civil 3D', 'Archicad', 'Renga'].map((software) => (
              <span key={software} className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white whitespace-nowrap">
                {software}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About Solution Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <div className="space-y-8 order-2 lg:order-1">
                <div className="inline-block px-4 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Комплексное решение
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight">
                  Гибридное решение <br />
                  <span className="text-blue-500">для девелопмента</span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed font-medium">
                  Для решения комплексных задач мы предлагаем сценарии, объединяющие аппаратные ресурсы, системы виртуализации и частного облака. Такой подход позволяет сочетать преимущества физической инфраструктуры и облачных технологий.
                </p>
                
                <div className="grid gap-6">
                    <div className="flex gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-lg font-bold text-white mb-1">Доступ к международным сервисам</h4>
                          <p className="text-slate-500 text-sm">Виртуальная машина-шлюз на зарубежной площадке обеспечивает бесперебойную работу с Jira, Autodesk и другими сервисами</p>
                       </div>
                    </div>
                    <div className="flex gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-lg font-bold text-white mb-1">Информационно-техническое сопровождение</h4>
                          <p className="text-slate-500 text-sm">Полноценная информационно-техническая поддержка АРМП и обучение проектировщиков работе в новых облачных средах САПР</p>
                       </div>
                    </div>
                </div>
             </div>
             
             <div className="relative order-1 lg:order-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-4 sm:pt-12">
                      <div className="h-full min-h-[300px] sm:min-h-0 aspect-[4/5] sm:aspect-auto rounded-[2rem] overflow-hidden relative border border-white/10 shadow-2xl shadow-blue-500/10 group">
                         <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800" alt="GPU Cloud" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                         <div className="absolute bottom-8 left-8 right-8">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center mb-5 backdrop-blur-md border border-blue-500/40">
                               <Cpu className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-display font-bold text-white leading-tight mb-2">vGPU Workstation</h4>
                            <p className="text-sm text-slate-400">Мощности для рендеринга и сложных вычислений в облаке</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="aspect-square rounded-[2rem] overflow-hidden relative border border-white/10 shadow-2xl shadow-blue-500/20 group">
                         <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800" alt="BIM Software" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                         <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent mix-blend-multiply" />
                         <div className="absolute bottom-6 left-6 right-6 z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center mb-3 backdrop-blur-md border border-white/20">
                               <Monitor className="w-5 h-5" />
                            </div>
                            <h4 className="text-xl font-display font-bold text-white leading-tight mb-1">BIM без лагов</h4>
                            <p className="text-xs text-blue-200">Комфортная работа с тяжелыми сборками</p>
                         </div>
                      </div>
                      
                      <div className="aspect-square rounded-[2rem] overflow-hidden relative border border-white/10 shadow-2xl shadow-indigo-500/20 group">
                         <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" alt="BIM + AI" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                         <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-900/40 to-transparent mix-blend-multiply" />
                         <div className="absolute bottom-6 left-6 right-6 z-10">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center mb-3 backdrop-blur-md border border-indigo-400/30">
                               <Rocket className="w-5 h-5" />
                            </div>
                            <h4 className="text-xl font-display font-bold text-white leading-tight mb-1">BIM + AI</h4>
                            <p className="text-xs text-indigo-200">Нейросети для генеративного проектирования</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 blur-[100px] rounded-full" />
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section id="calculator" className="py-32 px-6 bg-slate-50 text-slate-950 rounded-[4rem] mx-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/50 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-6xl font-display font-black text-slate-950 leading-[1.1] tracking-tight">
              Интерактивный <br />
              <span className="text-blue-600">калькулятор стоимости</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-md">
              Рассчитайте стоимость аренды АРМП и информационно-технической поддержки (ИТП) под ваши задачи
            </p>
            
            <div className="space-y-6 pt-4">
               <div className="flex items-center gap-6 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 italic font-serif text-2xl font-black shrink-0 underline decoration-blue-300">%</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 leading-tight">Экономическая эффективность</h4>
                    <p className="text-sm text-slate-500 mt-1">Отсутствие капитальных затрат и возврат НДС за весь период пользования</p>
                  </div>
               </div>
               
               <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-2xl shadow-blue-500/30">
                  <p className="text-sm font-black uppercase tracking-widest opacity-70 mb-4">Предварительный расчет (ИТОГО):</p>
                  <div className="flex flex-col gap-1">
                    {discount > 0 && (
                      <p className="text-2xl font-display font-bold line-through text-blue-300 opacity-80">
                        {((workstations * PRICING.its[tier].price + PRICING.infrastructure.vps + PRICING.infrastructure.support) * months).toLocaleString('ru-RU')} ₽
                      </p>
                    )}
                    <p className="text-5xl md:text-6xl font-display font-black">{total.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <p className="text-blue-200 text-sm mt-4 font-bold">Данный расчет не является публичной офертой и включает НДС</p>
               </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl ring-1 ring-slate-100">
             <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Кол-во рабочих мест (АРМП)</label>
                    <span className="text-2xl font-black text-blue-600">{workstations}</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" step="1" 
                    value={workstations} 
                    onChange={(e) => setWorkstations(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <span>1 место</span>
                    <span>50 мест</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Тариф ИТП поддержки</label>
                  <div className="grid gap-3">
                    {(Object.keys(PRICING.its) as Array<keyof typeof PRICING.its>).map((t) => (
                      <div 
                        key={t}
                        onClick={() => setTier(t)}
                        className={cn(
                          "cursor-pointer p-5 rounded-2xl border-2 transition-all group flex items-center justify-between",
                          tier === t ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            tier === t ? "border-blue-600" : "border-slate-200"
                          )}>
                            {tier === t && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{PRICING.its[t].name}</p>
                            <p className="text-xs text-slate-500 font-medium">{PRICING.its[t].description}</p>
                          </div>
                        </div>
                        <p className="font-black text-blue-600">{PRICING.its[t].price} <span className="text-[10px] opacity-70">₽/мес</span></p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Срок проекта (в месяцах)</label>
                  <div className="flex flex-wrap gap-4">
                    {[1, 3, 6, 12].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMonths(m)}
                        className={cn(
                          "relative px-6 py-3 rounded-xl text-sm font-bold transition-all",
                          months === m ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {m} м.
                        {m === 3 && <span className="absolute -top-2.5 -right-2.5 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">-5%</span>}
                        {m === 6 && <span className="absolute -top-2.5 -right-2.5 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">-10%</span>}
                        {m === 12 && <span className="absolute -top-2.5 -right-2.5 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">-15%</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <div className="bg-slate-50 p-6 rounded-2xl space-y-3 mb-8">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                         <span>АРМП {workstations} мест ({PRICING.its[tier].name})</span>
                         <span>{(workstations * PRICING.its[tier].price * months).toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                         <span>Инфраструктура (Шлюз + ИТС)</span>
                         <span>{((PRICING.infrastructure.vps + PRICING.infrastructure.support) * months).toLocaleString('ru-RU')} ₽</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-wider pt-3 border-t border-slate-200 mt-2">
                           <span>Скидка ({discount * 100}%)</span>
                           <div className="flex items-center gap-2">
                              <span className="line-through text-slate-400">{((workstations * PRICING.its[tier].price + PRICING.infrastructure.vps + PRICING.infrastructure.support) * months).toLocaleString('ru-RU')} ₽</span>
                              <span className="text-sm">{((workstations * PRICING.its[tier].price + PRICING.infrastructure.vps + PRICING.infrastructure.support) * months * (1 - discount)).toLocaleString('ru-RU')} ₽</span>
                           </div>
                        </div>
                      )}
                   </div>
                   
                   <button onClick={() => setIsModalOpen(true)} className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                      Получить АРМП
                      <ArrowRight className="w-5 h-5" />
                   </button>
                   <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6">
                      На следующем шаге необходимо заполнить контактную информацию
                   </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 relative z-10 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
           <div className="space-y-8 w-full lg:w-1/3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-display font-bold text-2xl shadow-lg shadow-blue-500/20 italic">P</div>
                <span className="font-display font-extrabold text-2xl tracking-tighter">Prop-Tech<span className="text-blue-500">.Group</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Цифровая трансформация и автоматизация всех этапов строительного проекта. ИТ-решения для проектирования и девелопмента полного цикла
              </p>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12 w-full lg:w-2/3">
              <div className="space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Решения</h4>
                 <ul className="space-y-4 text-sm text-slate-500 font-bold">
                    <li><a href="#" className="hover:text-blue-400 transition-colors">vGPU Workstation</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">BIM в облаке</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Гибридная ИТ</a></li>
                 </ul>
              </div>
              <div className="space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Для кого</h4>
                 <ul className="space-y-4 text-sm text-slate-500 font-bold">
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Застройщикам</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Проектировщикам</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Машиностроение</a></li>
                 </ul>
              </div>
              <div className="space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Связаться</h4>
                 <ul className="space-y-4 text-sm font-bold">
                    <li className="text-white">Email: kdi@prop-tech.group</li>
                    <li className="text-blue-500">Тел: +7 (495) 777-40-16</li>
                    <li>
                      <a href="https://t.me/proptech_group" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-white transition-colors flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Telegram
                      </a>
                    </li>
                    <li className="text-slate-500">129515, Москва, ул.Академика Королева, 13с4, подъезд 4, этаж 2, офис 75</li>
                 </ul>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] font-display">
            <p>© 2026 PROPTECH GROUP. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
            <div className="flex gap-10">
               <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
               <a href="#" className="hover:text-white transition-colors">Оферта</a>
            </div>
        </div>
      </footer>

      {/* Modal / Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-slate-100"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {isSuccess ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-black text-slate-950 mb-2">Заявка отправлена!</h3>
                <p className="text-slate-500">Наш менеджер свяжется с вами в ближайшее время.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-3xl font-display font-black text-slate-950 mb-2">Получить АРМП</h3>
                <p className="text-slate-500 mb-8">Оставьте свои контакты, чтобы мы подготовили детальный расчет для вашей компании.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Имя *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Телефон *</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                      placeholder="ivan@company.com"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Отправить заявку'}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-4 leading-relaxed">
                    Нажимая на кнопку, вы соглашаетесь с<br/> политикой конфиденциальности.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
