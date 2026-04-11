
import React from 'react';
import { ResumeData, ResumeTheme } from '../types';

interface Props {
  data: ResumeData;
}

const ResumePreview: React.FC<Props> = ({ data }) => {
  const theme: ResumeTheme = data.theme || 'minimalist';

  // Theme-specific style mappings
  const themeConfigs = {
    minimalist: {
      container: "font-sans",
      header: "text-center mb-8 border-b border-slate-200 pb-6",
      name: "text-3xl font-bold tracking-tight text-slate-900 mb-2 uppercase",
      sectionHeader: "text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1",
      accent: "text-slate-600",
      content: "text-slate-700",
    },
    classic: {
      container: "font-serif",
      header: "text-center mb-10 border-b-4 border-double border-slate-900 pb-8",
      name: "text-4xl font-semibold tracking-normal text-slate-900 mb-2 font-serif",
      sectionHeader: "text-base font-bold text-slate-900 uppercase tracking-normal mb-4 border-b-2 border-slate-900 pb-1 font-serif",
      accent: "text-slate-800",
      content: "text-slate-900",
    },
    modern: {
      container: "font-sans",
      header: "flex flex-col md:flex-row justify-between items-end mb-12 bg-slate-900 p-10 text-white rounded-lg",
      name: "text-4xl font-black tracking-tighter mb-2 md:mb-0",
      sectionHeader: "text-lg font-black text-indigo-600 uppercase tracking-tight mb-4 flex items-center gap-3 after:content-[''] after:h-px after:bg-indigo-100 after:flex-1",
      accent: "text-slate-500",
      content: "text-slate-700",
    },
    bold: {
      container: "font-sans",
      header: "mb-12 border-l-8 border-indigo-600 pl-8",
      name: "text-5xl font-black tracking-tight text-slate-900 mb-4",
      sectionHeader: "text-xl font-black text-slate-900 mb-6 bg-indigo-50 px-4 py-2 inline-block rounded-r-lg border-l-4 border-indigo-600",
      accent: "text-indigo-600 font-bold",
      content: "text-slate-800",
    },
    executive: {
      container: "font-sans",
      header: "mb-10 text-left border-b-2 border-slate-100 pb-10",
      name: "text-3xl font-light tracking-widest text-slate-900 mb-4 uppercase",
      sectionHeader: "text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4",
      accent: "text-slate-900 font-semibold",
      content: "text-slate-600",
    }
  };

  const config = themeConfigs[theme];

  const renderSectionHeader = (title: string) => {
    if (theme === 'executive') {
      return (
        <h2 className={config.sectionHeader}>
          {title}
          <span className="h-px bg-slate-100 flex-1"></span>
        </h2>
      );
    }
    return <h2 className={config.sectionHeader}>{title}</h2>;
  };

  return (
    <div className={`resume-container bg-white shadow-2xl rounded-sm p-12 min-h-[1056px] w-full max-w-[816px] mx-auto leading-relaxed border border-slate-100 print:shadow-none print:border-none print:p-0 ${config.container}`}>

      {/* Header */}
      <header className={config.header}>
        <div>
          <h1 className={config.name}>
            {data.fullName || "Your Full Name"}
          </h1>
          <div className={`flex flex-wrap ${theme === 'modern' ? 'justify-end' : theme === 'classic' || theme === 'minimalist' ? 'justify-center' : 'justify-start'} gap-4 text-sm ${theme === 'modern' ? 'text-indigo-200' : 'text-slate-600'}`}>
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
          </div>
          <div className={`flex flex-wrap ${theme === 'modern' ? 'justify-end' : theme === 'classic' || theme === 'minimalist' ? 'justify-center' : 'justify-start'} gap-4 text-sm mt-1 ${theme === 'modern' ? 'text-white/80' : 'text-slate-500'}`}>
            {data.linkedin && <span className="underline decoration-indigo-200">{data.linkedin}</span>}
            {data.website && <span className="underline decoration-indigo-200">{data.website}</span>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-10">
          {renderSectionHeader("Professional Summary")}
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${config.content}`}>{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-10">
          {renderSectionHeader("Experience")}
          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id} className="page-break-inside-avoid">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-sm ${theme === 'executive' ? 'uppercase tracking-wider' : ''}`}>{exp.company}</h3>
                  <span className={`text-xs font-medium ${config.accent}`}>
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <div className={`italic text-sm mb-3 ${config.accent}`}>{exp.position}</div>
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${config.content}`}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-10">
          {renderSectionHeader("Skills")}
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className={`${theme === 'modern' ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-700'} px-2 py-1 rounded text-xs font-medium`}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-10">
          {renderSectionHeader("Projects")}
          <div className="space-y-6">
            {data.projects.map((proj) => (
              <div key={proj.id} className="page-break-inside-avoid">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm">
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline text-xs font-normal">
                        Link ↗
                      </a>
                    )}
                  </h3>
                </div>
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${config.content}`}>
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-10">
          {renderSectionHeader("Certifications")}
          <div className="space-y-4">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="page-break-inside-avoid">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{cert.name}</h3>
                    <div className={`text-xs ${config.accent}`}>{cert.issuer}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${config.accent}`}>{cert.date}</span>
                    {cert.link && (
                      <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline text-xs mt-1">
                        View Credential ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section>
          {renderSectionHeader("Education")}
          <div className="space-y-6">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start page-break-inside-avoid">
                <div>
                  <h3 className="font-bold text-sm">{edu.institution}</h3>
                  <div className={`text-sm ${config.accent}`}>{edu.degree} in {edu.field}</div>
                </div>
                <span className={`text-xs ${config.accent}`}>{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
