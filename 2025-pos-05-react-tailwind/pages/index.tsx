import { useRef, useState, useEffect } from 'react';
import {
  Home,
  Search,
  Library,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Pause,
  Volume2,
  VolumeOff
} from 'lucide-react';

export default function PaginaInicial() {
  const referenciaAudio = useRef(null);

  const [estaSilenciado, setEstaSilenciado] = useState(false);
  const [estaTocando, setEstaTocando] = useState(false);
  const [estaRepetindo, setEstaRepetindo] = useState(false);
  const [estaEmbaralhado, setEstaEmbaralhado] = useState(false);
  const [indiceMusicaAtual, setIndiceMusicaAtual] = useState(0);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState(225); // Simulação de duração 

  const musicas = [
    { titulo: 'Time', artista: 'Pink Floyd' },
    { titulo: 'Comfortably Numb', artista: 'Pink Floyd' },
    { titulo: 'Wish You Were Here', artista: 'Pink Floyd' },
    { titulo: 'Hey You', artista: 'Pink Floyd' },
    { titulo: 'Shine On You Crazy Diamond', artista: 'Pink Floyd' },
    { titulo: 'Another Brick in the Wall', artista: 'Pink Floyd' }
  ];

  const alternarSilenciar = () => setEstaSilenciado(prev => !prev);
  const alternarTocar = () => setEstaTocando(prev => !prev);
  const alternarRepetir = () => setEstaRepetindo(prev => !prev);
  const alternarEmbaralhar = () => setEstaEmbaralhado(prev => !prev);

  const avancarMusica = () => {
    if (estaEmbaralhado) {
      const proximoIndice = Math.floor(Math.random() * musicas.length);
      setIndiceMusicaAtual(proximoIndice);
    } else {
      setIndiceMusicaAtual((prev) => (prev + 1) % musicas.length);
    }
    setEstaTocando(true);
  };

  const retrocederMusica = () => {
    setIndiceMusicaAtual((prev) =>
      prev === 0 ? musicas.length - 1 : prev - 1
    );
    setEstaTocando(true);
  };

  const horaAtual = new Date().getHours();
  const saudacao =
    horaAtual >= 5 && horaAtual < 12
      ? 'Bom dia'
      : horaAtual >= 12 && horaAtual < 18
      ? 'Boa tarde'
      : 'Boa noite';

  const musicaAtual = musicas[indiceMusicaAtual];

  useEffect(() => {
    let intervalo : number;

    if (estaTocando) {
      intervalo = window.setInterval(() => {
        setTempoAtual(prev => {
          if (prev >= duracao) {
            clearInterval(intervalo);
            if (estaRepetindo) {
              return 0;
            } else {
              setEstaTocando(false);
              return duracao;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalo);
  }, [estaTocando, duracao, estaRepetindo]);

  useEffect(() => {
    setTempoAtual(0); // Reinicia o tempo quando troca de música
  }, [indiceMusicaAtual]);

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${minutos}:${seg < 10 ? '0' : ''}${seg}`;
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-64 bg-black text-white p-4 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">
            <img src="/social.png" alt="" className="w-8 h-auto" />
          </h1>

            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 text-sm font-semibold hover:text-zinc-400">
                <Home className="w-5 h-5 mb-2" /> Início
              </a>
              <a href="#" className="flex items-center gap-3 text-sm font-semibold hover:text-zinc-400 mb-3">
                <Search className="w-5 h-5" /> Buscar
              </a>
              <a href="#" className="flex items-center gap-3 text-sm font-semibold hover:text-zinc-400">
                <Library className="w-5 h-5" /> Biblioteca
              </a>
            </nav>
          </div>
        </aside>

        <main className="flex-1 bg-zinc-900 text-white p-6">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{saudacao}</h2>
          </header>

          <section className="grid grid-cols-3 gap-4">
            {musicas.map((musica, i) => {
              const estaMusicaAtual = indiceMusicaAtual === i;
              return (
                <div
                  key={i}
                  className="bg-white/10 rounded-md overflow-hidden flex items-center gap-4 hover:bg-white/20 transition-colors"
                >
                  <img src="/img.png" alt="Capa do álbum" className="w-20 h-20" />
                  <strong className="text-white">{musica.titulo}</strong>
                  <button
                    className="ml-auto mr-4 bg-green-500 rounded-full w-10 h-10 flex items-center justify-center text-black hover:scale-105"
                    onClick={() => {
                      setIndiceMusicaAtual(i);
                      setEstaTocando(prev => (estaMusicaAtual ? !prev : true)); // pausa/play se clicar na mesma música
                    }}
                  >
                    {estaMusicaAtual && estaTocando ? <Pause /> : <Play />}
                  </button>
                </div>
              );
            })}
          </section>

        </main>
      </div>

      <footer className="bg-black text-white p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-[200px]">
          <img src="/img.png" alt="Capa do álbum" className="w-12 h-12 flex-shrink-0" />
          <div className="min-w-0">
            <strong className="block text-sm truncate w-40">{musicaAtual.titulo}</strong>
            <span className="text-xs text-zinc-400 truncate w-40 block">{musicaAtual.artista}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-6">
            <Shuffle
              className={`w-5 h-5 cursor-pointer ${estaEmbaralhado ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              onClick={alternarEmbaralhar}
            />
            <SkipBack
              className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer"
              onClick={retrocederMusica}
            />
            <button
              onClick={alternarTocar}
              className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 flex-shrink-0"
            >
              {estaTocando ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <SkipForward
              className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer"
              onClick={avancarMusica}
            />
            <Repeat
              className={`w-5 h-5 cursor-pointer ${estaRepetindo ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              onClick={alternarRepetir}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 w-full max-w-md">
            <span>{formatarTempo(tempoAtual)}</span>
            <div className="flex-1 h-1 bg-zinc-600 rounded-full relative overflow-hidden">
              <div
                className="h-1 bg-white absolute left-0 top-0"
                style={{ width: `${(tempoAtual / duracao) * 100}%` }}
              ></div>
            </div>
            <span>{formatarTempo(duracao)}</span>
          </div>
        </div>

        <div className="w-32 flex justify-end">
          {estaSilenciado ? (
            <VolumeOff
              className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer"
              onClick={alternarSilenciar}
            />
          ) : (
            <Volume2
              className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer"
              onClick={alternarSilenciar}
            />
          )}
        </div>
      </footer>
    </div>
  );
}
