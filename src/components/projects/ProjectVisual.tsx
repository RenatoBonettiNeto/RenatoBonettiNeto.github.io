import { Check, Circle, FileCode2, MousePointer2, Play } from 'lucide-react';

export function ProjectVisual() {
  return (
    <div
      className="project-visual"
      role="img"
      aria-label="Ilustração conceitual: interação, geração e teste. Não é uma captura do aplicativo."
    >
      <div className="visual-grid" />
      <div className="workflow-window">
        <div className="window-bar">
          <span />
          <span />
          <span />
          <span className="mono">interaction → test</span>
        </div>
        <div className="workflow-body">
          <div className="workflow-step">
            <span className="workflow-icon">
              <MousePointer2 size={21} />
            </span>
            <div>
              <span className="mono">01 / CAPTURE</span>
              <strong>Interações com propósito</strong>
            </div>
            <Circle size={8} className="record-dot" />
          </div>
          <div className="workflow-line" />
          <div className="workflow-step">
            <span className="workflow-icon">
              <FileCode2 size={21} />
            </span>
            <div>
              <span className="mono">02 / GENERATE</span>
              <strong>Cenários em código</strong>
            </div>
            <Check size={14} />
          </div>
          <div className="workflow-line" />
          <div className="workflow-step">
            <span className="workflow-icon">
              <Play size={19} />
            </span>
            <div>
              <span className="mono">03 / TEST</span>
              <strong>Playwright em ação</strong>
            </div>
            <Check size={14} />
          </div>
        </div>
      </div>
      <span className="visual-caption mono">VISÃO CONCEITUAL DO FLUXO</span>
    </div>
  );
}
