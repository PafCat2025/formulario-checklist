import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, QrCode } from 'lucide-react';

const MobileForm = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [showQR, setShowQR] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPerfilOpcao, setShowPerfilOpcao] = useState(false);
  const [showConclusao, setShowConclusao] = useState(false);
  const [perfilSalvo, setPerfilSalvo] = useState(null);
  const [assinatura, setAssinatura] = useState('');
  const [dataHoraConclusao, setDataHoraConclusao] = useState(null);
  const [assinaturaFormulario, setAssinaturaFormulario] = useState('');
  const canvasFormRef = useRef(null);
  const [isDrawingForm, setIsDrawingForm] = useState(false);
  const [formData, setFormData] = useState({
    tipoServico: '',
    subTipoServico: '',
    numeroCNH: '',
    nomeCompleto: '',
    razaoSocial: '',
    transportadora: '',
    tipoVeiculo: '',
    placaVeiculo: '',
    episSeguranca: [],
    telefoneWhatsapp: '',
    regrasAceitas: false,
    avisosAceitos: false,
    termoAceito: false,
    email: '',
    telefone: '',
    idade: '',
    interesse: '',
    mensagem: ''
  });

  const questions = [
    {
      id: 'tipoServico',
      question: 'Qual o tipo de prestação de serviço será realizado?',
      type: 'servico-tipo',
      options: [
        { value: 'Entrega', emoji: '📦' },
        { value: 'Descarga', emoji: '🚛' },
        { value: 'Coleta', emoji: '📋' }
      ],
      subOptions: {
        'Entrega': [
          { value: 'Almoxarifado', emoji: '🏭' },
          { value: 'Outros', emoji: '📍' }
        ],
        'Descarga': [
          { value: 'Gesso ou Calcário', emoji: '⚒️' },
          { value: 'Outros', emoji: '📍' }
        ],
        'Coleta': [
          { value: 'Almoxarifado', emoji: '🏭' },
          { value: 'Outros', emoji: '📍' }
        ]
      }
    },
    {
      id: 'nomeCompleto',
      question: 'Qual é o seu nome completo?',
      type: 'text',
      placeholder: 'Digite seu nome completo',
      minWords: 2
    },
    {
      id: 'razaoSocial',
      question: 'Qual é a Razão Social da empresa?',
      type: 'text',
      placeholder: 'Digite a razão social',
      minWords: 2,
      hint: '💡 Dica: A Razão Social é o nome oficial e completo da empresa registrado nos documentos legais (ex: "Transportes Silva Ltda")'
    },
    {
      id: 'transportadora',
      question: 'Qual é a Transportadora?',
      type: 'text',
      placeholder: 'Digite o nome da transportadora',
      minLength: 3
    },
    {
      id: 'tipoVeiculo',
      question: 'Qual é o tipo do veículo?',
      type: 'veiculo-tipo',
      options: [
        { value: 'Veículo Leve', emoji: '🚗' },
        { value: 'Veículo de Carga', emoji: '🚚' }
      ]
    },
    {
      id: 'episSeguranca',
      question: 'Quais EPIs de segurança você está usando?',
      type: 'epis-multiple',
      subtitle: 'Selecione todos que se aplicam',
      options: [
        { value: 'Botas de Segurança', emoji: '🥾', color: 'from-amber-500 to-orange-600' },
        { value: 'Colete Refletivo', emoji: '🦺', color: 'from-yellow-400 to-amber-500' },
        { value: 'Óculos de Proteção', emoji: '🥽', color: 'from-blue-400 to-indigo-500' },
        { value: 'Capacete com Jugular', emoji: '⛑️', color: 'from-red-500 to-rose-600' },
        { value: 'Protetor Auricular', emoji: '🎧', color: 'from-green-500 to-emerald-600' }
      ]
    },
    {
      id: 'telefoneWhatsapp',
      question: 'Qual é o seu número para contato e WhatsApp?',
      type: 'telefone',
      placeholder: '(00) 00000-0000'
    },
    {
      id: 'regrasSeguranca',
      question: 'Regras de Segurança da Empresa',
      type: 'regras-aceite',
      subtitle: 'Leia atentamente e confirme que compreendeu',
      regras: [
        {
          titulo: 'Proibido fumar',
          descricao: 'É estritamente proibido fumar em qualquer área da empresa',
          emoji: '🚭',
          tipo: 'proibicao'
        },
        {
          titulo: 'Uso de celular',
          descricao: 'Proibido o uso de celular durante operações e condução de veículos',
          emoji: '📵',
          tipo: 'proibicao'
        },
        {
          titulo: 'Proibido consumir alimentos',
          descricao: 'É proibido consumir qualquer tipo de alimento dentro da empresa',
          emoji: '🍔',
          tipo: 'proibicao'
        },
        {
          titulo: 'Velocidade máxima',
          descricao: 'Velocidade máxima de 20 km/h dentro das dependências',
          emoji: '⚠️',
          tipo: 'aviso'
        },
        {
          titulo: 'Atenção aos pedestres',
          descricao: 'Mantenha atenção redobrada. Pedestres têm prioridade',
          emoji: '🚶',
          tipo: 'advertencia'
        },
        {
          titulo: 'Siga a sinalização',
          descricao: 'Respeite toda sinalização horizontal e vertical',
          emoji: '⛔',
          tipo: 'obrigatorio'
        }
      ]
    },
    {
      id: 'avisosPerigoVeiculos',
      question: 'Avisos Importantes sobre Veículos de Carga',
      type: 'avisos-aceite',
      subtitle: 'Riscos e responsabilidades do condutor',
      avisos: [
        {
          titulo: 'Pontos cegos',
          descricao: 'Veículos de carga possuem pontos cegos amplos. Verifique antes de manobras',
          emoji: '👁️',
          cor: 'from-red-500 to-rose-600'
        },
        {
          titulo: 'Distância de frenagem',
          descricao: 'Veículos pesados precisam de maior distância para parar. Mantenha distância segura',
          emoji: '🛑',
          cor: 'from-orange-500 to-red-600'
        },
        {
          titulo: 'Calço nas rodas',
          descricao: 'OBRIGATÓRIO: Utilize calços de segurança nas rodas quando o veículo estiver parado',
          emoji: '🔶',
          cor: 'from-amber-500 to-orange-600'
        },
        {
          titulo: 'Deslonar em locais permitidos',
          descricao: 'A carga deve ser deslonada APENAS em áreas autorizadas e sinalizadas',
          emoji: '📦',
          cor: 'from-yellow-500 to-amber-600'
        },
        {
          titulo: 'Manobras lentas',
          descricao: 'Realize manobras com calma e atenção. Peça auxílio quando necessário',
          emoji: '🔄',
          cor: 'from-blue-500 to-cyan-600'
        },
        {
          titulo: 'Pedestres vulneráveis',
          descricao: 'Esteja sempre atento. Um acidente pode ser fatal',
          emoji: '⚠️',
          cor: 'from-red-600 to-rose-700'
        }
      ]
    },
    {
      id: 'termoResponsabilidade',
      question: 'Termo de Responsabilidade',
      type: 'termo-aceite',
      subtitle: 'Declaração obrigatória',
      termo: {
        titulo: '📋 Declaro que:',
        itens: [
          'Li e compreendi todas as regras de segurança',
          'Estou ciente dos riscos envolvidos na operação',
          'Me comprometo a seguir todas as normas estabelecidas',
          'Entendo que o não cumprimento pode resultar em expulsão',
          'Assumo total responsabilidade pelas minhas ações',
          'Compreendo a importância da segurança de todos'
        ]
      }
    },
    {
      id: 'conclusao',
      question: 'Checklist Concluído',
      type: 'conclusao',
      subtitle: 'Aguarde autorização para entrada'
    }
  ];

  const currentQuestion = questions[currentStep];
  
  // Carrega perfil salvo ao iniciar
  useEffect(() => {
    const perfilLocal = localStorage.getItem('perfilChecklistCofco');
    if (perfilLocal) {
      try {
        const perfil = JSON.parse(perfilLocal);
        setPerfilSalvo(perfil);
        // Carrega CNH automaticamente se existir
        if (perfil.numeroCNH) {
          setFormData(prev => ({
            ...prev,
            numeroCNH: perfil.numeroCNH
          }));
        }
      } catch (e) {
        console.error('Erro ao carregar perfil:', e);
      }
    }
  }, []);
  
  // Salva perfil após completar etapas 2, 3 e 4
  const salvarPerfil = () => {
    const perfil = {
      nomeCompleto: formData.nomeCompleto,
      razaoSocial: formData.razaoSocial,
      transportadora: formData.transportadora,
      tipoVeiculo: formData.tipoVeiculo,
      placaVeiculo: formData.placaVeiculo,
      numeroCNH: formData.numeroCNH,
      dataSalvamento: new Date().toISOString()
    };
    localStorage.setItem('perfilChecklistCofco', JSON.stringify(perfil));
    setPerfilSalvo(perfil);
  };
  
  // Carrega dados do perfil
  const usarPerfil = () => {
    if (perfilSalvo) {
      setFormData({
        ...formData,
        nomeCompleto: perfilSalvo.nomeCompleto,
        razaoSocial: perfilSalvo.razaoSocial || '',
        transportadora: perfilSalvo.transportadora,
        tipoVeiculo: perfilSalvo.tipoVeiculo,
        placaVeiculo: perfilSalvo.placaVeiculo,
        numeroCNH: perfilSalvo.numeroCNH || ''
      });
      setShowPerfilOpcao(false);
      setCurrentStep(5);
    }
  };
  
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleInputChange = (value) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value
    });
  };

  const isCurrentStepValid = () => {
    if (currentQuestion.optional) return true;
    
    if (currentQuestion.type === 'servico-tipo') {
      const tipoServico = formData.tipoServico;
      const subTipo = formData.subTipoServico;
      const cnh = formData.numeroCNH;
      
      if (!tipoServico) return false;
      if (!subTipo) return false;
      
      if (tipoServico === 'Descarga' && subTipo === 'Gesso ou Calcário') {
        return cnh && cnh.length >= 8;
      }
      
      return true;
    }
    
    if (currentQuestion.id === 'nomeCompleto') {
      const nome = formData.nomeCompleto.trim();
      const palavras = nome.split(/\s+/).filter(p => p.length > 0);
      return palavras.length >= 2;
    }
    
    if (currentQuestion.id === 'razaoSocial') {
      const razao = formData.razaoSocial.trim();
      const palavras = razao.split(/\s+/).filter(p => p.length > 0);
      return palavras.length >= 2;
    }
    
    if (currentQuestion.id === 'transportadora') {
      return formData.transportadora.trim().length >= 3;
    }
    
    if (currentQuestion.type === 'veiculo-tipo') {
      const tipoVeiculo = formData.tipoVeiculo;
      const placa = formData.placaVeiculo;
      
      if (!tipoVeiculo) return false;
      return placa && placa.length === 7;
    }
    
    if (currentQuestion.type === 'epis-multiple') {
      return formData.episSeguranca.length >= 1;
    }
    
    if (currentQuestion.type === 'telefone') {
      const numeros = formData.telefoneWhatsapp.replace(/\D/g, '');
      return numeros.length === 11;
    }
    
    if (currentQuestion.type === 'regras-aceite') {
      return formData.regrasAceitas === true;
    }
    
    if (currentQuestion.type === 'avisos-aceite') {
      return formData.avisosAceitos === true;
    }
    
    if (currentQuestion.type === 'termo-aceite') {
      return formData.termoAceito === true;
    }
    
    if (currentQuestion.type === 'conclusao') {
      return true;
    }
    
    const value = formData[currentQuestion.id];
    return value && value.trim() !== '';
  };

  const handleNext = () => {
    if (isCurrentStepValid() && currentStep < questions.length - 1) {
      if (currentStep === 4) {
        salvarPerfil();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (isCurrentStepValid()) {
      // Valida se tem assinatura
      if (!assinaturaFormulario) {
        alert('⚠️ Por favor, assine antes de enviar o checklist.');
        return;
      }
      
      setDataHoraConclusao(new Date());
      setShowConclusao(true);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    setAssinatura(canvas.toDataURL());
  };

  const limparAssinatura = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAssinatura('');
  };

  // Funções para assinatura no formulário
  const startDrawingForm = (e) => {
    const canvas = canvasFormRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawingForm(true);
  };

  const drawForm = (e) => {
    if (!isDrawingForm) return;
    e.preventDefault();
    
    const canvas = canvasFormRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawingForm = () => {
    setIsDrawingForm(false);
    const canvas = canvasFormRef.current;
    setAssinaturaFormulario(canvas.toDataURL());
  };

  const limparAssinaturaForm = () => {
    const canvas = canvasFormRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAssinaturaFormulario('');
  };

  const gerarTextoChecklist = () => {
    const dataHora = dataHoraConclusao ? 
      `${dataHoraConclusao.toLocaleDateString('pt-BR')} às ${dataHoraConclusao.toLocaleTimeString('pt-BR')}` : '';
    
    const episSelecionados = formData.episSeguranca.join(', ') || 'Nenhum';
    
    return `
🏢 *CHECKLIST DE ACESSO - COFCO INTERNATIONAL*

📋 *DADOS DO VISITANTE*
Nome: ${formData.nomeCompleto}
Transportadora: ${formData.transportadora}
Telefone/WhatsApp: ${formData.telefoneWhatsapp}

🚗 *DADOS DO VEÍCULO*
Tipo: ${formData.tipoVeiculo}
Placa: ${formData.placaVeiculo}

📦 *TIPO DE SERVIÇO*
Serviço: ${formData.tipoServico}
Categoria: ${formData.subTipoServico}
${formData.numeroCNH ? `CNH: ${formData.numeroCNH}` : ''}

🛡️ *EPIs UTILIZADOS*
${episSelecionados}

📅 *DATA E HORA*
${dataHora}

✅ *CONFIRMAÇÃO*
Declaro que li e aceito todas as regras de segurança da empresa.

━━━━━━━━━━━━━━━━━━━━
Assinatura digital registrada
━━━━━━━━━━━━━━━━━━━━
    `.trim();
  };

  const enviarWhatsApp = async () => {
    const dadosParaEnviar = {
      nomeCompleto: formData.nomeCompleto.toUpperCase(),
      transportadora: formData.transportadora.toUpperCase(),
      telefoneWhatsapp: formData.telefoneWhatsapp,
      tipoServico: formData.tipoServico.toUpperCase(),
      subTipoServico: formData.subTipoServico.toUpperCase(),
      tipoVeiculo: formData.tipoVeiculo.toUpperCase(),
      placaVeiculo: formData.placaVeiculo.toUpperCase(),
      numeroCNH: formData.numeroCNH || '',
      episSeguranca: formData.episSeguranca,
      assinatura: assinatura,
      assinaturaFormulario: assinaturaFormulario
    };
    
    try {
      const url = 'https://script.google.com/macros/s/AKfycbxShdShLHmvgFpOLppONeeSnEmF-sK9HvXk9RytbHUQOLSbH0RpPj1onG_8CC2nyqQ4/exec';
      
      // Mostra loading
      const btnEnviar = document.querySelector('button[disabled]');
      const textoOriginal = 'Enviando...';
      
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar)
      });
      
      // Como é no-cors, assume sucesso
      alert(`✅ Checklist enviado com sucesso!\n\nVocê receberá uma mensagem no WhatsApp com sua senha quando estiver liberado para entrar.\n\n⏳ Aguarde no veículo ou em área segura.`);
      
      // Limpa formulário
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      alert('❌ Erro ao enviar. Verifique sua conexão e tente novamente.');
      console.error(error);
    }
  };

  const compartilharChecklist = async () => {
    const texto = gerarTextoChecklist();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Checklist COFCO',
          text: texto
        });
      } catch (err) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      navigator.clipboard.writeText(texto);
      alert('Checklist copiado! Cole no WhatsApp da empresa.');
    }
  };

  const getTipText = () => {
    if (currentStep < 0 || currentStep >= questions.length) return '';
    
    const tips = {
      'tipoServico': '💡 Selecione o tipo de serviço e depois escolha a categoria específica',
      'nomeCompleto': '👤 Digite seu nome completo (nome e sobrenome)',
      'transportadora': '🚛 Informe o nome da empresa transportadora',
      'tipoVeiculo': '🚗 Escolha o tipo de veículo e informe a placa',
      'episSeguranca': '🛡️ Sua segurança é prioridade! Selecione os EPIs que você está usando',
      'telefoneWhatsapp': '📱 Digite seu número de celular com DDD para contato via WhatsApp',
      'regrasSeguranca': '⚠️ Estas regras são obrigatórias para sua segurança e de todos',
      'avisosPerigoVeiculos': '🚨 Informações críticas sobre operação segura de veículos',
      'termoResponsabilidade': '📝 Sua confirmação é necessária para prosseguir',
      'conclusao': '✅ Parabéns! Você completou todas as etapas'
    };
    
    return tips[currentQuestion.id] || '';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isCurrentStepValid()) {
      if (currentStep === questions.length - 1) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  // Tela de conclusão
  if (showConclusao) {
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
            <div className="text-7xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-white mb-2">Checklist Concluído!</h1>
            <p className="text-white opacity-90">Obrigado por preencher com atenção</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
              <p className="text-center text-blue-800 font-semibold">
                📅 {dataHoraConclusao?.toLocaleDateString('pt-BR')}
              </p>
              <p className="text-center text-blue-600 text-lg font-bold">
                🕐 {dataHoraConclusao?.toLocaleTimeString('pt-BR')}
              </p>
            </div>

            <div className="border-3 border-gray-300 rounded-xl p-4 bg-gray-50">
              <label className="block text-gray-800 font-bold mb-3 text-center">
                ✍️ Assinatura Digital
              </label>
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full border-2 border-gray-300 rounded-lg bg-white cursor-crosshair touch-none"
              />
              <button
                onClick={limparAssinatura}
                className="mt-2 w-full py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300"
              >
                🗑️ Limpar assinatura
              </button>
            </div>

            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⏳</span>
                Próximos passos:
              </h3>
              <ul className="space-y-2 text-amber-800">
                <li className="flex items-start gap-2">
                  <span>1️⃣</span>
                  <span>Envie o checklist pelo WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2️⃣</span>
                  <span>Aguarde no veículo ou em área segura</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3️⃣</span>
                  <span>Você receberá autorização via WhatsApp ou ligação</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={enviarWhatsApp}
                disabled={!assinatura}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  assinatura
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">💬</span>
                Enviar via WhatsApp
              </button>

              <button
                onClick={compartilharChecklist}
                disabled={!assinatura}
                className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  assinatura
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                📤 Compartilhar
              </button>
            </div>

            {!assinatura && (
              <p className="text-center text-red-600 text-sm font-semibold">
                ⚠️ Assine acima para enviar o checklist
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tela de opção de perfil
  if (showPerfilOpcao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center">
            <div className="text-6xl mb-3">👤</div>
            <h1 className="text-2xl font-bold text-white mb-2">Perfil Detectado!</h1>
            <p className="text-white opacity-90">Quer usar seus dados salvos?</p>
          </div>

          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-3 border-blue-300 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">📋 Dados salvos:</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-blue-700">Nome:</span>
                  <span className="text-gray-700">{perfilSalvo.nomeCompleto}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-blue-700">Transportadora:</span>
                  <span className="text-gray-700">{perfilSalvo.transportadora}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-blue-700">Veículo:</span>
                  <span className="text-gray-700">{perfilSalvo.tipoVeiculo}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-blue-700">Placa:</span>
                  <span className="text-gray-700 font-mono">{perfilSalvo.placaVeiculo}</span>
                </div>
                {perfilSalvo.numeroCNH && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-700">CNH:</span>
                    <span className="text-gray-700 font-mono">{perfilSalvo.numeroCNH}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm text-center">
                ✨ Usando o perfil, você vai direto para a etapa de EPIs (Etapa 5)
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={usarPerfil}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Check size={24} />
                Sim, usar meu perfil
              </button>

              <button
                onClick={() => {
                  setShowPerfilOpcao(false);
                  setCurrentStep(1);
                }}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Não, preencher novamente
              </button>

              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir seu perfil salvo?')) {
                    localStorage.removeItem('perfilChecklistCofco');
                    setPerfilSalvo(null);
                    setShowPerfilOpcao(false);
                    setCurrentStep(1);
                  }
                }}
                className="w-full bg-red-50 text-red-600 font-semibold py-3 px-6 rounded-xl hover:bg-red-100 transition-all duration-200 text-sm"
              >
                🗑️ Excluir perfil salvo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showQR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full text-center">
          <div className="mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-4 mb-4">
              <svg viewBox="0 0 710 260" className="w-full h-auto max-w-xs mx-auto">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#4A90E2', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#87CEEB', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#E8F4F8', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#FFB84D', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#FFA500', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#FF8C00', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="grad3" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#90EE90', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#98FB98', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#00FF00', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
                <g transform="translate(80, 80)">
                  <path d="M 50 0 L 100 25 L 100 75 L 50 100 L 0 75 L 0 25 Z" fill="url(#grad1)" stroke="#2C5F8D" strokeWidth="1"/>
                  <path d="M 50 0 L 100 25 L 100 75 L 50 50 Z" fill="url(#grad2)" stroke="#CC6600" strokeWidth="1"/>
                  <path d="M 50 0 L 0 25 L 0 75 L 50 50 Z" fill="url(#grad3)" stroke="#228B22" strokeWidth="1"/>
                  <ellipse cx="50" cy="35" rx="25" ry="15" fill="white" opacity="0.3"/>
                </g>
                <text x="200" y="100" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#5D4037">中粮国际</text>
                <text x="200" y="150" fontFamily="Arial, sans-serif" fontSize="52" fontWeight="bold" fill="#5D4037" letterSpacing="2">COFCO INTL</text>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">COFCO</h1>
            <h2 className="text-3xl font-bold text-blue-600 mb-3">International</h2>
            <p className="text-gray-600 text-sm">Formulário de Acesso</p>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border-4 border-blue-200 mb-4">
            <svg viewBox="0 0 29 29" className="w-full max-w-xs mx-auto">
              <rect width="29" height="29" fill="white"/>
              <path d="M0,0h7v7h-7z M8,0h1v1h-1z M10,0h2v1h1v1h-1v1h-1v-1h-1z M13,0h2v1h-1v1h-1z M16,0h1v1h-1z M18,0h2v1h-2z M22,0h7v7h-7z M1,1v5h5v-5z M10,1h1v1h-1z M15,1h1v2h-1v1h-1v-1h1z M23,1v5h5v-5z M2,2h3v3h-3z M11,2h1v1h-1z M17,2h1v1h-1z M24,2h3v3h-3z M9,3h1v2h1v-1h2v1h-1v1h-2v1h-1v-1h-1v-1h2z M20,3h1v1h-1z M12,4h1v1h-1z M16,4h2v1h-2z M19,4h1v2h-1z M9,5h1v1h-1z M0,8h1v2h1v-1h1v2h-3z M3,8h3v1h1v1h-1v1h1v1h-2v-1h-2v1h-1v-2h1v-1h1z M7,8h1v1h-1z M11,8h1v1h1v1h-2z M15,8h1v1h-1z M17,8h1v1h-1z M20,8h2v1h-2z M8,9h2v1h-2z M13,9h2v1h-1v1h-1z M18,9h1v1h-1z M1,10h1v1h-1z M10,10h1v1h-1z M16,10h1v1h1v1h-2z M21,10h1v3h-1v1h-1v-3h1z M7,11h1v1h-1z M9,11h1v1h-1z M11,11h2v1h1v1h-4v-1h1z M8,12h1v1h-1z M18,12h2v1h-2z M0,13h1v1h1v1h-2z M3,13h4v1h-1v1h-1v1h-1v-2h-1z M14,13h1v1h-1z M16,13h1v1h-1z M19,13h1v1h-1z M9,14h2v1h-2z M12,14h2v2h-1v-1h-1z M17,14h1v1h-1z M1,15h1v1h-1z M7,15h1v2h-2v-1h1z M15,15h1v1h-1z M20,15h1v1h-1z M4,16h2v1h-2z M9,16h1v1h-1z M11,16h1v2h-1z M16,16h3v1h-3z M8,17h1v1h-1z M13,17h2v1h-1v1h-1z M19,17h2v1h1v1h-1v2h-1v1h-1v-4h1z M0,18h2v1h-2z M3,18h1v1h-1z M5,18h2v1h1v1h-1v1h-1v2h-1v-1h-2v-1h2z M15,18h1v2h1v-1h1v1h-1v1h1v1h-1v1h-1v-4h-1z M21,18h1v1h-1z M3,19h1v1h-1z M9,19h2v1h-2z M12,19h1v2h-1z M1,20h2v1h-2z M8,20h1v1h-1z M22,20h2v1h-2z M25,20h3v1h-3z M0,21h1v1h-1z M10,21h1v1h-1z M17,21h1v1h-1z M24,21h1v1h-1z M0,22h7v7h-7z M8,22h3v1h-3z M13,22h1v1h1v1h-1v1h-2v-2h1z M21,22h1v1h-1z M23,22h2v1h1v1h-3z M27,22h2v2h-2z M1,23v5h5v-5z M16,23h1v1h1v2h-2v1h-1v-3h1z M26,23h1v2h-1v1h-1v-1h1z M2,24h3v3h-3z M9,24h3v1h-3z M19,24h2v1h-2z M22,24h2v1h-1v1h-1z M8,25h1v2h-1v1h-1v-2h1z M12,25h1v1h-1z M20,25h1v1h-1z M24,25h1v1h1v1h-2z M27,25h2v1h-2z M10,26h2v1h-2z M13,26h2v1h-2z M17,26h2v2h-2z M21,26h2v1h-2z M25,26h1v1h-1z M9,27h1v2h-1z M11,27h1v1h-1z M13,27h3v1h-1v1h-2z M20,27h4v1h-1v1h-2v-1h-1z M26,27h3v2h-3z M10,28h1v1h-1z M19,28h1v1h-1z M25,28h1v1h-1z" fill="black"/>
            </svg>
          </div>

          <button
            onClick={() => {
              setShowQR(false);
              setShowWelcome(true);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Abrir Formulário
          </button>
          
          <p className="text-sm text-gray-500 mt-3">
            ou use este link: <span className="font-mono text-blue-600">form.app/xyz123</span>
          </p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center">
            <div className="bg-white rounded-2xl p-6 w-64 mx-auto mb-4 shadow-lg">
              <svg viewBox="0 0 710 260" className="w-full h-auto">
                <defs>
                  <linearGradient id="grad1b" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#4A90E2', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#87CEEB', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#E8F4F8', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="grad2b" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#FFB84D', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#FFA500', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#FF8C00', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="grad3b" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#90EE90', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#98FB98', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#00FF00', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
                <g transform="translate(80, 80)">
                  <path d="M 50 0 L 100 25 L 100 75 L 50 100 L 0 75 L 0 25 Z" fill="url(#grad1b)" stroke="#2C5F8D" strokeWidth="1"/>
                  <path d="M 50 0 L 100 25 L 100 75 L 50 50 Z" fill="url(#grad2b)" stroke="#CC6600" strokeWidth="1"/>
                  <path d="M 50 0 L 0 25 L 0 75 L 50 50 Z" fill="url(#grad3b)" stroke="#228B22" strokeWidth="1"/>
                  <ellipse cx="50" cy="35" rx="25" ry="15" fill="white" opacity="0.3"/>
                </g>
                <text x="200" y="100" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#5D4037">中粮国际</text>
                <text x="200" y="150" fontFamily="Arial, sans-serif" fontSize="52" fontWeight="bold" fill="#5D4037" letterSpacing="2">COFCO INTL</text>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo à</h1>
            <h2 className="text-2xl font-bold text-white">COFCO International</h2>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Checklist de Segurança
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Antes de prosseguir, confirme os itens abaixo:
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                  <Check size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">EPIs obrigatórios</p>
                  <p className="text-sm text-gray-600">Capacete, óculos de proteção, luvas e calçado de segurança</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                  <Check size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Área sinalizada</p>
                  <p className="text-sm text-gray-600">Verifique a sinalização e respeite os limites de segurança</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                  <Check size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Condições do ambiente</p>
                  <p className="text-sm text-gray-600">Ambiente limpo, organizado e sem riscos aparentes</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                  <Check size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Procedimentos conhecidos</p>
                  <p className="text-sm text-gray-600">Estou ciente dos procedimentos de segurança da área</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowWelcome(false);
                setCurrentStep(0);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Iniciar Checklist
              <ChevronRight size={20} />
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              🛡️ Sua segurança é nossa prioridade
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              {questions.map((_, idx) => (
                <div key={idx} className="flex items-center">
                  <div className={`transition-all duration-300 ${
                    idx === currentStep 
                      ? 'w-10 h-3 bg-white rounded-full' 
                      : idx < currentStep 
                        ? 'w-3 h-3 bg-white rounded-full'
                        : 'w-3 h-3 bg-white bg-opacity-30 rounded-full'
                  }`}></div>
                  {idx < questions.length - 1 && (
                    <div className={`w-6 h-0.5 ${
                      idx < currentStep ? 'bg-white' : 'bg-white bg-opacity-30'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-white text-sm font-medium opacity-90">
                Etapa {currentStep + 1} de {questions.length}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="bg-white bg-opacity-20 rounded-full px-4 py-1">
                  <p className="text-white text-xs font-semibold">
                    {Math.round(((currentStep + 1) / questions.length) * 100)}% Completo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 min-h-[400px] flex flex-col">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 animate-fade-in">
              {currentQuestion.question}
            </h2>
            
            {currentQuestion.subtitle && (
              <p className="text-gray-600 mb-3 text-center font-medium">{currentQuestion.subtitle}</p>
            )}
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-6 rounded-r-lg">
              <p className="text-sm text-blue-800">{getTipText()}</p>
            </div>

            {currentQuestion.type === 'servico-tipo' ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    if (formData.tipoServico && formData.tipoServico !== option.value) {
                      return null;
                    }
                    
                    return (
                      <div key={idx}>
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              tipoServico: option.value,
                              subTipoServico: '',
                              numeroCNH: ''
                            });
                          }}
                          className={`w-full p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                            formData.tipoServico === option.value
                              ? 'border-4 shadow-2xl scale-105 bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'border-2 border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg text-gray-700 hover:scale-102'
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all ${
                              formData.tipoServico === option.value ? 'border-white bg-white' : 'border-gray-400'
                            }`}>
                              {formData.tipoServico === option.value && (
                                <span className="w-4 h-4 rounded-full bg-blue-600"></span>
                              )}
                            </span>
                            <span className="text-5xl">{option.emoji}</span>
                            <span className="flex-1 text-left font-bold text-xl">{option.value}</span>
                          </span>
                        </button>
                        
                        {formData.tipoServico === option.value && (
                          <button
                            onClick={() => {
                              setFormData({
                                ...formData,
                                tipoServico: '',
                                subTipoServico: '',
                                numeroCNH: ''
                              });
                            }}
                            className="w-full mt-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            🔄 Mudar escolha
                          </button>
                        )}
                        
                        {formData.tipoServico === option.value && (
                          <div className="mt-4 space-y-3 animate-fade-in flex flex-col items-center">
                            {currentQuestion.subOptions[option.value].map((subOption, subIdx) => (
                              <button
                                key={subIdx}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    subTipoServico: subOption.value,
                                    numeroCNH: ''
                                  });
                                }}
                                className={`w-4/5 p-4 rounded-xl border-3 transition-all duration-300 transform ${
                                  formData.subTipoServico === subOption.value
                                    ? 'border-4 shadow-xl scale-105 bg-gradient-to-r from-cyan-400 to-blue-400 text-white'
                                    : 'border-2 border-gray-200 bg-gray-50 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-md text-gray-700'
                                }`}
                              >
                                <span className="flex items-center justify-center gap-3">
                                  <span className={`w-6 h-6 rounded-lg border-3 flex items-center justify-center ${
                                    formData.subTipoServico === subOption.value ? 'border-white bg-white' : 'border-gray-400'
                                  }`}>
                                    {formData.subTipoServico === subOption.value && (
                                      <Check size={16} className="text-cyan-600 font-bold" />
                                    )}
                                  </span>
                                  <span className="text-2xl">{subOption.emoji}</span>
                                  <span className="font-bold text-base">{subOption.value}</span>
                                </span>
                              </button>
                            ))}
                            
                            {formData.tipoServico === 'Descarga' && formData.subTipoServico === 'Gesso ou Calcário' && (
                              <div className="w-4/5 mt-2 animate-fade-in bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-400 rounded-xl p-5 shadow-lg">
                                <label className="block text-base font-bold text-amber-900 mb-3 flex items-center gap-3">
                                  <span className="text-4xl">🪪</span>
                                  <span>Digite o número da sua CNH</span>
                                </label>
                                <input
                                  type="text"
                                  value={formData.numeroCNH}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setFormData({
                                      ...formData,
                                      numeroCNH: value
                                    });
                                  }}
                                  placeholder="00000000000"
                                  maxLength="11"
                                  className="w-full p-4 border-3 border-amber-400 rounded-xl focus:border-amber-600 focus:outline-none text-xl font-bold text-center bg-white tracking-wider shadow-inner"
                                />
                                {formData.numeroCNH.length >= 8 && (
                                  <div className="mt-3 p-3 bg-green-100 border-2 border-green-400 rounded-lg">
                                    <p className="text-green-800 font-bold text-center">
                                      ✓ CNH válida
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : currentQuestion.type === 'veiculo-tipo' ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    if (formData.tipoVeiculo && formData.tipoVeiculo !== option.value) {
                      return null;
                    }
                    
                    return (
                      <div key={idx}>
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              tipoVeiculo: option.value,
                              placaVeiculo: ''
                            });
                          }}
                          className={`w-full p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                            formData.tipoVeiculo === option.value
                              ? 'border-4 shadow-2xl scale-105 bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'border-2 border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg text-gray-700 hover:scale-102'
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-full border-3 flex items-center justify-center ${
                              formData.tipoVeiculo === option.value ? 'border-white bg-white' : 'border-gray-400'
                            }`}>
                              {formData.tipoVeiculo === option.value && (
                                <span className="w-4 h-4 rounded-full bg-blue-600"></span>
                              )}
                            </span>
                            <span className="text-5xl">{option.emoji}</span>
                            <span className="flex-1 text-left font-bold text-xl">{option.value}</span>
                          </span>
                        </button>
                        
                        {formData.tipoVeiculo === option.value && (
                          <button
                            onClick={() => {
                              setFormData({
                                ...formData,
                                tipoVeiculo: '',
                                placaVeiculo: ''
                              });
                            }}
                            className="w-full mt-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            🔄 Mudar escolha
                          </button>
                        )}
                        
                        {formData.tipoVeiculo === option.value && (
                          <div className="mt-4 animate-fade-in flex justify-center">
                            <div className="w-4/5 bg-gradient-to-r from-blue-50 to-cyan-50 border-3 border-blue-400 rounded-xl p-5 shadow-lg">
                              <label className="block text-base font-bold text-blue-900 mb-3 flex items-center justify-center gap-3">
                                <span className="text-4xl">🚗</span>
                                <span>{option.value === 'Veículo Leve' ? 'Placa do Veículo' : 'Placa do Cavalo'}</span>
                              </label>
                              <input
                                type="text"
                                value={formData.placaVeiculo}
                                onChange={(e) => {
                                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                  setFormData({
                                    ...formData,
                                    placaVeiculo: value
                                  });
                                }}
                                placeholder="ABC1D23"
                                maxLength="7"
                                className="w-full p-4 border-3 border-blue-400 rounded-xl focus:border-blue-600 focus:outline-none text-2xl font-bold text-center bg-white tracking-widest shadow-inner"
                              />
                              {formData.placaVeiculo.length === 7 && (
                                <div className="mt-3 p-3 bg-green-100 border-2 border-green-400 rounded-lg">
                                  <p className="text-green-800 font-bold text-center">
                                    ✓ Placa válida
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : currentQuestion.type === 'epis-multiple' ? (
              <div className="space-y-3">
                {currentQuestion.options.map((epi, idx) => {
                  const isSelected = formData.episSeguranca.includes(epi.value);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const current = formData.episSeguranca;
                        const updated = isSelected
                          ? current.filter(item => item !== epi.value)
                          : [...current, epi.value];
                        setFormData({
                          ...formData,
                          episSeguranca: updated
                        });
                      }}
                      className={`w-full p-5 rounded-2xl border-3 transition-all duration-300 transform hover:scale-102 ${
                        isSelected
                          ? `border-4 shadow-2xl scale-105 bg-gradient-to-r ${epi.color} text-white`
                          : 'border-2 border-gray-300 bg-white hover:border-gray-400 hover:shadow-lg text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg border-3 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-white border-white' : 'border-gray-400'
                        }`}>
                          {isSelected && <Check size={20} className="text-green-600 font-bold" />}
                        </div>
                        
                        <div className="text-5xl">{epi.emoji}</div>
                        
                        <div className="flex-1 text-left">
                          <p className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {epi.value}
                          </p>
                          {isSelected && (
                            <p className="text-sm text-white opacity-90 mt-1">✓ Selecionado</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
                
                {formData.episSeguranca.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl text-center animate-fade-in">
                    <p className="text-green-800 font-bold">
                      ✓ {formData.episSeguranca.length} EPI{formData.episSeguranca.length > 1 ? 's' : ''} selecionado{formData.episSeguranca.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            ) : currentQuestion.type === 'telefone' ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-3 border-green-400 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-5xl">📱</span>
                  <span className="text-5xl">💬</span>
                </div>
                <input
                  type="tel"
                  value={formData.telefoneWhatsapp}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    if (value.length > 11) value = value.slice(0, 11);
                    
                    if (value.length > 0) {
                      if (value.length <= 2) {
                        value = `(${value}`;
                      } else if (value.length <= 7) {
                        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                      } else {
                        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                      }
                    }
                    
                    setFormData({
                      ...formData,
                      telefoneWhatsapp: value
                    });
                  }}
                  placeholder="(00) 00000-0000"
                  className="w-full p-4 border-3 border-green-400 rounded-xl focus:border-green-600 focus:outline-none text-2xl font-bold text-center bg-white tracking-wider shadow-inner"
                />
                
                <div className="mt-4 text-center">
                  {formData.telefoneWhatsapp.replace(/\D/g, '').length === 11 ? (
                    <div className="p-4 bg-green-100 border-2 border-green-400 rounded-lg animate-fade-in">
                      <p className="text-green-800 font-bold flex items-center justify-center gap-2">
                        <span className="text-2xl">✓</span>
                        Número válido para WhatsApp
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <p className="text-blue-700 font-semibold">
                        Digite 11 dígitos (DDD + número)
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        {[...Array(11)].map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              idx < formData.telefoneWhatsapp.replace(/\D/g, '').length
                                ? 'bg-green-500 scale-110'
                                : 'bg-gray-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : currentQuestion.type === 'regras-aceite' ? (
              <div className="space-y-3">
                {currentQuestion.regras.map((regra, idx) => {
                  const cores = {
                    'proibicao': 'from-red-500 to-rose-600',
                    'aviso': 'from-amber-500 to-orange-600',
                    'advertencia': 'from-orange-500 to-red-600',
                    'obrigatorio': 'from-blue-500 to-cyan-600'
                  };
                  
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border-3 bg-gradient-to-r ${cores[regra.tipo]} text-white shadow-lg`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-5xl flex-shrink-0">{regra.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2">{regra.titulo}</h3>
                          <p className="text-white opacity-95">{regra.descricao}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-6 bg-white border-3 border-red-500 rounded-xl p-5 shadow-lg">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.regrasAceitas}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          regrasAceitas: e.target.checked
                        });
                      }}
                      className="w-7 h-7 mt-1 cursor-pointer accent-red-600"
                    />
                    <span className="flex-1 font-bold text-gray-800 text-lg">
                      Li e compreendi todas as regras de segurança acima e me comprometo a segui-las rigorosamente
                    </span>
                  </label>
                </div>
              </div>
            ) : currentQuestion.type === 'avisos-aceite' ? (
              <div className="space-y-3">
                <div className="bg-red-100 border-3 border-red-500 rounded-xl p-5 mb-4">
                  <p className="text-red-800 font-bold text-center text-lg flex items-center justify-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    ATENÇÃO: Informações Críticas de Segurança
                  </p>
                </div>
                
                {currentQuestion.avisos.map((aviso, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border-3 bg-gradient-to-r ${aviso.cor} text-white shadow-lg transform hover:scale-102 transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-5xl flex-shrink-0">{aviso.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2">{aviso.titulo}</h3>
                        <p className="text-white opacity-95 leading-relaxed">{aviso.descricao}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 bg-white border-3 border-orange-500 rounded-xl p-5 shadow-lg">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.avisosAceitos}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          avisosAceitos: e.target.checked
                        });
                      }}
                      className="w-7 h-7 mt-1 cursor-pointer accent-orange-600"
                    />
                    <span className="flex-1 font-bold text-gray-800 text-lg">
                      Estou ciente dos riscos e me comprometo a operar o veículo com máxima atenção e responsabilidade
                    </span>
                  </label>
                </div>
              </div>
            ) : currentQuestion.type === 'termo-aceite' ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4 text-center">{currentQuestion.termo.titulo}</h3>
                  <div className="space-y-3">
                    {currentQuestion.termo.itens.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-xl flex-shrink-0">✓</span>
                        <p className="text-white font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border-4 border-blue-600 rounded-xl p-6 shadow-xl">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termoAceito}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          termoAceito: e.target.checked
                        });
                      }}
                      className="w-8 h-8 mt-1 cursor-pointer accent-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 text-xl block mb-2">
                        Aceito e concordo com todos os termos
                      </span>
                      <span className="text-gray-600">
                        Ao marcar esta caixa, confirmo que li, compreendi e concordo em cumprir todas as declarações acima.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            ) : currentQuestion.type === 'conclusao' ? (
              <div className="text-center space-y-6">
                <div className="text-8xl mb-4">✍️</div>
                <h3 class="text-2xl font-bold text-gray-800">
                  Última Etapa: Assinatura
                </h3>
                <p className="text-gray-600 text-lg">
                  Assine abaixo para confirmar as informações
                </p>
                
                {/* Campo de assinatura no formulário */}
                <div className="border-3 border-blue-400 rounded-xl p-4 bg-blue-50">
                  <label className="block text-gray-800 font-bold mb-3 text-center">
                    ✍️ Assinatura Digital
                  </label>
                  <canvas
                    ref={canvasFormRef}
                    width={300}
                    height={150}
                    onMouseDown={startDrawingForm}
                    onMouseMove={drawForm}
                    onMouseUp={stopDrawingForm}
                    onMouseLeave={stopDrawingForm}
                    onTouchStart={startDrawingForm}
                    onTouchMove={drawForm}
                    onTouchEnd={stopDrawingForm}
                    className="w-full border-2 border-gray-300 rounded-lg bg-white cursor-crosshair touch-none"
                  />
                  <button
                    onClick={limparAssinaturaForm}
                    className="mt-2 w-full py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300"
                  >
                    🗑️ Limpar assinatura
                  </button>
                </div>
                
                {!assinaturaFormulario && (
                  <p className="text-center text-red-600 text-sm font-semibold">
                    ⚠️ Assine acima para continuar
                  </p>
                )}
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-3 border-green-400 rounded-xl p-6">
                  <p className="text-green-800 font-semibold text-lg">
                    ✅ Todas as informações foram preenchidas corretamente
                  </p>
                </div>
              </div>
            ) : currentQuestion.type === 'textarea' ? (
              <div className="space-y-4">
                {currentQuestion.hint && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                    <p className="text-amber-800 text-sm font-medium">
                      {currentQuestion.hint}
                    </p>
                  </div>
                )}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-3 border-blue-300 rounded-xl p-5 shadow-lg">
                  <textarea
                    value={formData[currentQuestion.id]}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentQuestion.placeholder}
                    className="w-full p-4 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg resize-none shadow-inner"
                    rows="6"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentQuestion.hint && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                    <p className="text-amber-800 text-sm font-medium">
                      {currentQuestion.hint}
                    </p>
                  </div>
                )}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-3 border-blue-300 rounded-xl p-5 shadow-lg">
                <input
                  type={currentQuestion.type}
                  value={formData[currentQuestion.id]}
                  onChange={(e) => handleInputChange(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none text-xl font-semibold shadow-inner uppercase"
                />
              </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              <ChevronLeft size={20} />
              Voltar
            </button>

            {currentStep < questions.length - 1 ? (
              isCurrentStepValid() && (
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transform hover:scale-105"
                >
                  Próxima
                  <ChevronRight size={20} />
                </button>
              )
            ) : (
              isCurrentStepValid() && (
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105"
                >
                  <Check size={20} />
                  Enviar
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileForm;
                    
