import { MICROSERVICES } from '../data/mockData';

export default function Infrastructure() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Services', val: MICROSERVICES.length },
          { label: 'Spring Boot',    val: '3.3.5' },
          { label: 'Java Version',   val: '21 LTS' },
          { label: 'JAR Builds',     val: '10 / 10' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">{k.label}</p>
            <p className="font-display text-[1.9rem] font-light text-[#1C1C1A] mt-1.5">{k.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE8] flex items-center justify-between">
          <div>
            <h2 className="font-display text-[17px] font-light text-[#1C1C1A]">Microservice Registry</h2>
            <p className="text-[10px] text-[#A09A91] mt-0.5">All services built with <span className="font-mono bg-[#F2F0EC] px-1.5 py-0.5 rounded">mvn clean package -DskipTests</span></p>
          </div>
          <span className="text-[11px] font-semibold text-[#1A6645] bg-[#EBF5F0] border border-[#b3deca] px-3 py-1 rounded-full">✓ All 10 Built</span>
        </div>
        <div className="divide-y divide-[#F5F3EF]">
          {MICROSERVICES.map(m => (
            <div key={m.port} className="px-6 py-4 flex items-start gap-5 hover:bg-[#FAFAF8] transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-[#1C1C1A]">{m.name}</p>
                  {m.tech.map(t => (
                    <span key={t} className="text-[10px] font-medium text-[#6B6560] bg-[#F2F0EC] border border-[#E8E6E1] px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
                <p className="text-[11px] text-[#A09A91] mt-0.5">{m.description}</p>
                <p className="text-[10px] text-[#A09A91] font-mono mt-0.5">{m.jar}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-mono text-[12px] text-[#6B6560] bg-[#F2F0EC] px-2.5 py-1 rounded-full">:{m.port}</span>
                <p className="text-[10px] text-[#1A6645] font-semibold mt-1.5">✓ JAR Ready</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stack summary */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm p-6">
        <h2 className="font-display text-[17px] font-light text-[#1C1C1A] mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Framework', val: 'Spring Boot 3.3.5' },
            { label: 'Language',   val: 'Java 21 (LTS)' },
            { label: 'Cloud',      val: 'Spring Cloud 2023.0.3' },
            { label: 'Discovery',  val: 'Eureka (Netflix OSS)' },
            { label: 'Gateway',    val: 'Spring Cloud Gateway' },
            { label: 'Auth',       val: 'OAuth2 / Keycloak' },
            { label: 'Messaging',  val: 'Apache Kafka' },
            { label: 'Database',   val: 'MySQL (JPA/Hibernate)' },
            { label: 'Container',  val: 'Docker Compose' },
            { label: 'Build',      val: 'Maven (Wrapper)' },
            { label: 'Frontend',   val: 'Vite + React 18' },
            { label: 'Styling',    val: 'Tailwind CSS v3' },
          ].map(t => (
            <div key={t.label} className="bg-[#FAFAF8] rounded-xl border border-[#F0EDE8] px-4 py-3">
              <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">{t.label}</p>
              <p className="text-[12px] font-semibold text-[#1C1C1A] mt-1">{t.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

