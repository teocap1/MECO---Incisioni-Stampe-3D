import { getCategoryLabel, calculateDiscountedPrice } from '../utils/helpers.js';
import { getProducts, getProductById } from '../services/supabase-service.js';

// DATI PRODOTTI (copia ESATTAMENTE dall'originale)
export const productsData = {
    incisioni: [
        {
            id: 'INC1',
            name: 'Fiocco Nascita',
            description: 'Fiocco nascita personalizzato, realizzato su misura per accogliere il/la nuovo/a arrivato/a con stile e dolcezza',
            descrizioneApprofondita: 'Fiocco nascita personalizzato, ideale per celebrare il nuovo arrivo. Realizzato con materiali di qualità e curato nei dettagli, è perfetto da appendere alla porta o nella cameretta come dolce ricordo.',
            basePrice: 30.00,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-05-15T00:00:00',
                    endDate: '2026-06-30T23:59:59'
                },
                label: 'OFFERTA ESTIVA',
                promoId: 'estate2026'
            },
            category: 'bambini',
            image: 'img/incisioni/fioccoNascita/fioccoNascita.jpeg',
            gallery: [
                'img/incisioni/fioccoNascita/fioccoNascita.jpeg',
                'img/incisioni/fioccoNascita/fioccoNascita (2).jpg',
                'img/incisioni/fioccoNascita/fioccoNascita (3).jpg',
                'img/incisioni/fioccoNascita/fioccoNascita (4).jpg',
                'img/incisioni/fioccoNascita/fioccoNascita (5).jpg',
                'img/incisioni/fioccoNascita/fioccoNascita (6).jpg',
            ],
            customizations: {
                wood: { label: 'Tipo di Legno', options: [
                    { name: 'Betulla', price: 0 },
                    { name: 'Balsa', price: 1 }
                ]},
                thickness: { label: 'Spessore', options: [
                    { name: '3mm', price: 0 }
                ]},
                decorazioni: { label: 'Decorazioni', options: [
                    { name: 'Solo decorazioni in legno', price: 0 },
                    { name: 'Decorazioni in legno e floreali', price: 5 },
                ]},
                colore: { label: 'Colore delle decorazioni', options: [
                    { name: 'Blu', price: 0 },
                    { name: 'Rosa', price: 0 },
                    { name: 'Personalizzato', price: 2 }
                ]},
                text: { label: 'Nome e colore personalizzato (se selezionato)', type: 'text', maxLength: 50 }
            }
        },
        {
            id: 'INC2',
            name: 'Incisione su Tavolino',
            description: 'Tavolino in legno con incisione laser personalizzabile',
            descrizioneApprofondita: 'Tavolino elegante personalizzato con incisione laser.',
            basePrice: 20,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-11-15T00:00:00', // Data/ora di inizio
                    endDate: '2026-11-30T23:59:59'    // Data/ora di fine
                },
                label: 'OFFERTA BLACK FRIDAY',
                promoId: 'blackFriday2026'
            },
            category: 'arredamento',
            image: 'img/incisioni/incisioneTavolino/tavolinoPubTorrione.jpeg',
            gallery: [
                'img/incisioni/incisioneTavolino/tavolinoPubTorrione.jpeg',
            ],
            customizations: {
                dimensioni: {
                    label: 'Dimensioni',
                    options: [
                        { name: '20x20cm', price: 0 },
                        { name: '40x40cm', price: 10 },
                        { name: '50x50cm', price: 15 },
                        { name: '60x60cm', price: 20 },
                        { name: '70x70cm', price: 25 },
                        { name: '80x80cm', price: 30 }
                    ]
                },

                names: { label: 'Personalizzazione', type: 'text', maxLength: 100 },
            }
        },
        {
            id: 'INC3',
            name: 'Foto Incisione',
            description: 'Foto incisione personalizzata su legno, un modo per conservare i tuoi ricordi in modo unico.',
            descrizioneApprofondita: 'Incisione su legno di una foto personalizzata, perfetta per creare un ricordo unico e duraturo. Realizzata con tecnologia laser di alta precisione, questa incisione trasforma la tua immagine in un pezzo d\'arte da esporre o regalare. <br><br> NB: per garantire la migliore qualità di incisione, è necessario inviare il file in formato immagine HD al momento dell\'ordine.',
            basePrice: 20,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-11-15T00:00:00', // Data/ora di inizio
                    endDate: '2026-11-30T23:59:59'    // Data/ora di fine
                },
                label: 'OFFERTA BLACK FRIDAY',
                promoId: 'blackFriday2026'
            },
            category: 'decorazioni',
            image: 'img/incisioni/fotoIncisioni/fotoIncisione.jpeg',
            gallery: [
                'img/incisioni/fotoIncisioni/fotoIncisione.jpeg',
            ],
            customizations: {
                dimensioni: {
                    label: 'Dimensioni',
                    options: [
                        { name: '10x15cm', price: 0 },
                        { name: '13x18cm', price: 3 },
                        { name: '15x20cm', price: 5 },
                        { name: '20x20cm', price: 7 },
                        { name: '20x25cm', price: 9 },
                        { name: '25x35cm', price: 10 }
                    ]
                },

                names: { label: 'Personalizzazione (Frase/Data/Altro)', type: 'text', maxLength: 100 },
            }
        },
        {
            id: 'INC4',
            name: 'Gioco Tris Pasquale',
            description: 'Gioco Tris in legno con incisioni pasquali, perfetto come pensiero o decorazione per la Pasqua.',
            descrizioneApprofondita: 'Gioco Tris in legno con incisioni pasquali, ideale originale come regalo per piccini. Ogni pezzo è inciso con motivi pasquali, rendendo il gioco non solo divertente ma anche decorativo. Perfetto come regalo o come elemento di arredo per la Pasqua.',
            basePrice: 6,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-03-01T00:00:00', // Data/ora di inizio
                    endDate: '2026-04-05T00:00:00'    // Data/ora di fine
                },
                label: 'OFFERTA DI PASQUA',
                promoId: 'pasqua2026'
            },
            category: 'pasqua',
            image: 'img/incisioni/tris/tris (2).jpg',
            gallery: [
                'img/incisioni/tris/tris (2).jpg',
                'img/incisioni/tris/tris (1).jpg'
            ],
            customizations: {
                quantity: { label: 'Quantità Set', options: [
                    { name: '1 pezzo', price: 0 },
                    { name: '3 pezzi', price: 18 },
                    { name: '5 pezzi', price: 30 },
                    { name: '10 pezzi', price: 60 }
                ]},
                colore: { label: 'Colore Cornice', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Viola', price: 0 },
                    { name: 'Rosa', price: 0 },
                    { name: 'Arancio', price: 0 }
                ]},
                colore1: { label: 'Colore Uova', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Viola', price: 0 },
                    { name: 'Rosa', price: 0 },
                    { name: 'Arancio', price: 0 }
                ]},
                colore2: { label: 'Colore Coniglietti', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Viola', price: 0 },
                    { name: 'Rosa', price: 0 },
                    { name: 'Arancio', price: 0 }
                ]},

                personalization: { label: 'Nome', type: 'text', maxLength: 20 }
            }
        },
        {
            id: 'INC5',
            name: 'Rose Incise - Mamma',
            description: 'Rose incise su legno, un regalo perfetto per la festa della mamma o per ogni occasione speciale.',
            descrizioneApprofondita: 'Rose incise su legno, perfette per celebrare la festa della mamma o come regalo romantico. Ogni pezzo è realizzato con cura e attenzione ai dettagli, rendendo queste rose un simbolo di amore e affetto. Ideali come decorazione per la casa o come pensiero speciale per una persona cara.',
            basePrice: 7,
            promotion: {
                active: false,
                schedule: {
                    startDate: '2025-12-13T13:04:40', // Data/ora di inizio
                    endDate: '2025-12-13T13:05:30'    // Data/ora di fine
                },
                discount: 10, // percentuale
                label: 'OFFERTA SAN VALENTINO',
                promoId: 'sanvalentino2026'
            },
            category: 'gadget',
            image: 'img/incisioni/rose/rose (5).jpg',
            gallery: [
                'img/incisioni/rose/rose (5).jpg',
                'img/incisioni/rose/rose (2).jpg',
                'img/incisioni/rose/rose (3).jpg',
                'img/incisioni/rose/rose (4).jpg',
                'img/incisioni/rose/rose (1).jpg',
                'img/incisioni/rose/rose (6).jpg'
            ],
            customizations: {
                colore: { label: 'Colore Rosa', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Viola', price: 0 },
                    { name: 'Rosa', price: 0 }
                ]},
            }
        },
        {
            id: 'INC6',
            name: 'Segnalibro Personalizzato',
            description: 'Segnalibro in legno personalizzato, ideale per gli amanti della lettura e dei regali unici.',
            descrizioneApprofondita: 'Segnalibro in legno personalizzato, perfetto per gli appassionati di lettura. Ogni segnalibro è inciso con cura e può essere personalizzato con nomi, citazioni o disegni a scelta, rendendolo un regalo unico e speciale per ogni amante dei libri.',
            basePrice: 7,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2025-12-01T00:00:00', // Data/ora di inizio
                    endDate: '2025-12-31T23:59:59'    // Data/ora di fine
                },
                label: 'OFFERTA NATALIZIA',
                promoId: 'natale2025'
            },
            category: 'gadget',
            image: 'img/incisioni/segnalibro/segnalibro (2).jpg',
            gallery: [
                'img/incisioni/segnalibro/segnalibro (2).jpg',
                'img/incisioni/segnalibro/segnalibro (1).jpg'
            ],
            customizations: {
                colore: { label: 'Colore Nappina', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Viola', price: 0 },
                    { name: 'Rosa', price: 0 },
                    { name: 'Arancio', price: 0 }
                ]},

                personalization: { label: 'Personalizzazione', type: 'text', maxLength: 100 }
            }
        },
        {
            id: 'INC7',
            name: 'Stemmi Harry Potter Multistrato',
            description: 'Stemmi di Harry Potter in legno multistrato, perfetti per decorare la tua casa o come regalo per i fan della saga.',
            descrizioneApprofondita: 'Ogni stemma è inciso con precisione e può essere appeso o esposto su una mensola, aggiungendo un tocco magico a qualsiasi ambiente.',
            basePrice: 15,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-10-15T00:00:00', // Data/ora di inizio
                    endDate: '2026-11-14T23:59:59'    // Data/ora di fine
                },
                label: 'OFFERTA HARRY POTTER',
                promoId: 'harrypotter2026'
            },
            category: 'decorazioni',
            image: 'img/incisioni/stemmi/Incisioni.png',
            gallery: [
                'img/incisioni/stemmi/Incisioni.png',
                'img/incisioni/stemmi/stemmi (4).jpg',
                'img/incisioni/stemmi/stemmi (1).jpg',
                'img/incisioni/stemmi/stemmi (2).jpg',
                'img/incisioni/stemmi/stemmi (3).jpg',
            ],
            customizations: {
                pack: { label: 'Pacchetto', options: [
                    { name: '1 stemma', price: 0 },
                    { name: '2 stemmi', price: 30 },
                    { name: '3 stemmi', price: 45 },
                    { name: '4 stemmi', price: 60 },
                    { name: '5 stemmi', price: 70 }
                ]},
            }
        },
        {
            id: 'INC8',
            name: 'Orologio da Parete Personalizzato',
            description: 'Orologio da parete in legno con incisione laser personalizzabile, un tocco di eleganza per ogni ambiente.',
            descrizioneApprofondita: 'Orologio da parete in legno personalizzato con incisione laser, ideale per aggiungere un tocco di stile e personalità a qualsiasi stanza. Realizzato con materiali di alta qualità, questo orologio è sia funzionale che decorativo, perfetto come regalo unico o per arricchire la tua casa.',
            basePrice: 35,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-11-15T00:00:00', // Data/ora di inizio
                    endDate: '2026-11-30T23:59:59'    // Data/ora di fine
                },
                label: 'OFFERTA BLACK FRIDAY',
                promoId: 'blackFriday2026'
            },
            category: 'arredamento',
            image: 'img/incisioni/orologioParete/orologioParete.jpeg',
            gallery: [
                'img/incisioni/orologioParete/orologioParete.jpeg',
            ],
            customizations: {
                dimensioni: {
                    label: 'Dimensioni',
                    options: [
                        { name: '30cm', price: 0 },
                        { name: '40cm', price: 10 },
                        { name: '50cm', price: 15 }
                    ]
                },

                names: { label: 'Personalizzazione', type: 'text', maxLength: 100 },
            }
        }
    ],
    stampe3d: [
        {
            id: 'ST3D1',
            name: 'Scacchiera - Harry Potter',
            description: 'Scacchiera in plastica PLA con base in legno compensato',
            descrizioneApprofondita: 'Scacchiera ispirata al magico mondo di Harry Potter, perfetta per collezionisti e appassionati. La base è realizzata in legno compensato resistente, mentre tabellone e pedine sono stampati in 3D con plastica di alta qualità, per un design dettagliato e duraturo. Ideale come regalo o per aggiungere un tocco di magia alle tue partite a scacchi.',
            basePrice: 40,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-10-15T00:00:00', // Data/ora di inizio
                    endDate: '2026-11-14T23:59:59'    // Data/ora di fine
                },
                label: 'OFFERTA HARRY POTTER',
                promoId: 'harrypotter2026'
            },
            category: 'giochi',
            image: 'img/stampe3D/scacchiera/Stampe3D.png',
            gallery: [
                'img/stampe3D/scacchiera/Stampe3D.png',
                'img/stampe3D/scacchiera/scacchiera1.jpg',
                'img/stampe3D/scacchiera/scacchiera2.jpg',
                'img/stampe3D/scacchiera/scacchiera3.jpg',
                'img/stampe3D/scacchiera/scacchiera4.jpg',
                'img/stampe3D/scacchiera/scacchiera5.jpg'
            ],
            customizations: {
                colore: { label: 'Colore Squadra 1', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 }
                ]},
                colore1: { label: 'Colore Squadra 2', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 }
                ]},
                colore2: { label: 'Colore Legno di Base', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 1  },
                    { name: 'Giallo', price: 1  },
                    { name: 'Blu', price: 1 },
                    { name: 'Verde', price: 1 }
                ]},
                quality: { label: 'Risoluzione', options: [
                    { name: 'Draft (0.3mm)', price: 0 },
                    { name: 'Standard (0.2mm)', price: 0 },
                    { name: 'High Quality (0.16mm)', price: 3 },
                    { name: 'Fine (0.12mm)', price: 5 },
                    { name: 'Ultra Fine (0.08mm)', price: 7 }
                ]},
                text: { label: 'Testo Personalizzato', type: 'text', maxLength: 50 }
            }
        },
        {
            id: 'ST3D2',
            name: 'Stand per bacchette - Harry Potter',
            description: 'Stand in plastica stampata in 3D per esporre le bacchette di Harry Potter, ideale per collezionisti.',
            descrizioneApprofondita: 'Stand realizzato interamente in plastica stampata in 3D, progettato per esporre in modo elegante e ordinato le bacchette ispirate al mondo di Harry Potter. Robusto e curato nei dettagli, offre un supporto stabile e scenografico per la tua collezione, perfetto per fan e collezionisti della saga. (Tema Doni della Morte)',
            basePrice: 30,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-10-15T00:00:00', // Data/ora di inizio
                    endDate: '2026-11-14T23:59:59'    // Data/ora di fine
                },
                label: 'OFFERTA HARRY POTTER',
                promoId: 'harrypotter2026'
            },
            category: 'arredamento',
            image: 'img/stampe3D/portaBacchette/harryPotterWand.jpeg',
            gallery: [
                'img/stampe3D/portaBacchette/harryPotterWand.jpeg',
                'img/stampe3D/portaBacchette/wandStand (1).jpg',
                'img/stampe3D/portaBacchette/wandStand (2).jpg',
                'img/stampe3D/portaBacchette/wandStand (3).jpg',
                'img/stampe3D/portaBacchette/wandStand (4).jpg'
            ],
            customizations: {
                colore: { label: 'Colore', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 1  },
                    { name: 'Giallo', price: 1  },
                    { name: 'Blu', price: 1 },
                    { name: 'Verde', price: 1 },
                    { name: 'Oro', price: 1 },
                    { name: 'Argento', price: 1 },
                ]},
                colore1: { label: 'Colore Cornice', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 1  },
                    { name: 'Giallo', price: 1  },
                    { name: 'Blu', price: 1 },
                    { name: 'Verde', price: 1 },
                    { name: 'Oro', price: 1 },
                    { name: 'Argento', price: 1 },
                    { name: 'Azzurro (Fluorescente)', price: 3 }
                ]},
                quality: { label: 'Risoluzione', options: [
                    { name: 'Draft (0.3mm)', price: 0 },
                    { name: 'Standard (0.2mm)', price: 0 },
                    { name: 'High Quality (0.16mm)', price: 3 },
                    { name: 'Fine (0.12mm)', price: 5 },
                    { name: 'Ultra Fine (0.08mm)', price: 7 }
                ]},
            }
        },
        {
            id: 'ST3D3',
            name: 'Abat-jour',
            description: 'Abat-jour in plastica stampata in 3D dal design moderno, ideale per arredare con stile.',
            descrizioneApprofondita: 'Abat-jour elegante e moderno, realizzato in plastica stampata in 3D. Il design unico e contemporaneo lo rende perfetto per ogni ambiente, dalla camera da letto al soggiorno. Disponibile in diverse colorazioni, è un complemento d\'arredo che unisce funzionalità e stile.',
            basePrice: 50,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-05-15T00:00:00',
                    endDate: '2026-06-30T23:59:59'
                },
                label: 'OFFERTA ESTIVA',
                promoId: 'estate2026'
            },
            category: 'arredamento',
            image: 'img/stampe3D/luci/lampada3D.jpeg',
            gallery: [
                'img/stampe3D/luci/lampada3D.jpeg',
                'img/stampe3D/luci/lampada (1).jpg',
                'img/stampe3D/luci/lampada (2).jpg',
                'img/stampe3D/luci/lampada (3).jpg',
                'img/stampe3D/luci/lampada (4).jpg',
                'img/stampe3D/luci/lampada (5).jpg'
            ],
            customizations: {
                colore: { label: 'Colore della Base', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Personalizzato', price: 0 }
                ]},
                quality: { label: 'Risoluzione', options: [
                    { name: 'Draft (0.3mm)', price: 0 },
                    { name: 'Standard (0.2mm)', price: 0 },
                    { name: 'High Quality (0.16mm)', price: 6 },
                    { name: 'Fine (0.12mm)', price: 8 },
                    { name: 'Ultra Fine (0.08mm)', price: 10 }
                ]},

                personalization: { label: 'Inserire il colore personalizzato se selezionato', type: 'text', maxLength: 30 }
            }
        },
        {
            id: 'ST3D4',
            name: 'Elefantino effetto uncinetto',
            description: 'Elefantino decorativo stampato in 3D con effetto uncinetto, ideale per arredare, come regalo, come segnaposto per un battesimo.',
            descrizioneApprofondita: 'Elefantino decorativo stampato in 3D con effetto uncinetto, perfetto per aggiungere un tocco di originalità e stile alla tua casa o come idea regalo unica. Realizzato con cura e attenzione ai dettagli, è ideale anche come segnaposto per battesimi o come decorazione per la cameretta dei bambini.',
            basePrice: 4,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-05-15T00:00:00',
                    endDate: '2026-06-30T23:59:59'
                },
                label: 'OFFERTA ESTIVA',
                promoId: 'estate2026'
            },
            category: 'decorazioni',
            image: 'img/stampe3D/segnaposto/segnapostoBattesimo.jpeg',
            gallery: [
                'img/stampe3D/segnaposto/segnapostoBattesimo.jpeg',
                'img/stampe3D/segnaposto/elefantinoMaglia (1).jpg',
                'img/stampe3D/segnaposto/elefantinoMaglia (2).jpg',
                'img/stampe3D/segnaposto/elefantinoMaglia (3).jpg',
                'img/stampe3D/segnaposto/elefantinoMaglia (4).jpg',
                'img/stampe3D/segnaposto/elefantinoMaglia (5).jpg',
            ],
            customizations: {
                quality: { label: 'Risoluzione', options: [
                    { name: 'Draft (0.3mm)', price: 0 },
                    { name: 'Standard (0.2mm)', price: 0 },
                    { name: 'High Quality (0.16mm)', price: 1 },
                    { name: 'Fine (0.12mm)', price: 2 },
                    { name: 'Ultra Fine (0.08mm)', price: 3 }
                ]},
                colore1: { label: 'Colore Elefantino', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Personalizzato', price: 0 }
                ]},
                colore2: { label: 'Colore Cuore', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Personalizzato', price: 0 }
                ]},
                personalization: { label: 'Inserire i colori personalizzati se selezionati (in ordine)', type: 'text', maxLength: 30 }
            }
        },
        {
            id: 'ST3D5',
            name: 'Scritta centrotavola',
            description: 'Scritta personalizzata in plastica stampata in 3D, ideale come centrotavola per battesimi, comunioni, cresime, matrimoni, o altri eventi speciali.',
            descrizioneApprofondita: 'Realizzata con cura e attenzione ai dettagli, questa scritta può essere personalizzata con nomi, date o frasi significative, rendendo ogni evento ancora più speciale e memorabile.',
            basePrice: 25,
            promotion: {
                active: true,
                discount: 10, // percentuale
                schedule: {
                    startDate: '2026-05-15T00:00:00',
                    endDate: '2026-06-30T23:59:59'
                },
                label: 'OFFERTA ESTIVA',
                promoId: 'estate2026'
            },
            category: 'decorazioni',
            image: 'img/stampe3D/scritta/scritta (3).jpg',
            gallery: [
                'img/stampe3D/scritta/scritta (3).jpg',
                'img/stampe3D/scritta/scritta (2).jpg',
                'img/stampe3D/scritta/scritta (1).jpg'
            ],
            customizations: {
                dimensioni: { label: 'Dimensioni Cubi', options: [
                    { name: '8x8x5', price: 0 },
                    { name: '8x8x8', price: 5 },
                    { name: '10x10x10', price: 10 }
                ]},
                quantità: { label: 'Quantità delle Lettere', options: [
                    { name: '3-5', price: 0 },
                    { name: '6-9', price: 5 },
                    { name: '10-x', price: 10 }
                ]},
                quality: { label: 'Risoluzione', options: [
                    { name: 'Draft (0.3mm)', price: 0 },
                    { name: 'Standard (0.2mm)', price: 0 },
                    { name: 'High Quality (0.16mm)', price: 3 },
                    { name: 'Fine (0.12mm)', price: 5 },
                    { name: 'Ultra Fine (0.08mm)', price: 7 }
                ]},
                colore: { label: 'Colore Cubi', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Arancio', price: 0 },
                    { name: 'Rosa', price: 0 },
                    { name: 'Viola', price: 0 },
                    { name: 'Personalizzato', price: 0 }
                ]},
                colors: { label: 'Colore Lettere', options: [
                    { name: 'Nero', price: 0 },
                    { name: 'Rosso', price: 0  },
                    { name: 'Giallo', price: 0  },
                    { name: 'Blu', price: 0 },
                    { name: 'Verde', price: 0 },
                    { name: 'Oro', price: 0 },
                    { name: 'Argento', price: 0 },
                    { name: 'Arancio', price: 0 },
                    { name: 'Rosa', price: 0 },
                    { name: 'Viola', price: 0 },
                    { name: 'Personalizzato', price: 0 }
                ]},
                personalization: { label: 'Inserire i colori personalizzati se selezionati (in ordine)', type: 'text', maxLength: 30 }
            }
        },
    ]
};

export class ProductsManager {
    constructor(app) {
        console.log('📦 ProductsManager inizializzato');
        this.app = app;
        this.products = []; // Per prodotti da Supabase
        this.filteredProducts = [];
        this.productsLocal = this.getAllLocalProducts(); // Per prodotti locali
        
        // Lega i metodi al contesto corretto
        this.loadProducts = this.loadProducts.bind(this);
        this.formatProduct = this.formatProduct.bind(this);
        this.renderProducts = this.renderProducts.bind(this);
        this.filterProducts = this.filterProducts.bind(this);
    }

    // RESTAURATO: Metodo per ottenere tutti i prodotti locali
    getAllLocalProducts() {
        return [...productsData.incisioni, ...productsData.stampe3d];
    }

    // RESTAURATO: Metodo per trovare prodotto locale per ID
    getLocalProductById(productId) {
        for (const category in productsData) {
            const product = productsData[category].find(p => p.id === productId);
            if (product) return product;
        }
        return null;
    }

    // NUOVO: Metodo per caricare prodotti (prima da Supabase, poi fallback locale)
    async loadProducts() {
        console.log('🛍️ Caricamento prodotti...');
        
        try {
            // Prima prova da Supabase
            const { data, error } = await getProducts();
            
            if (error) {
                console.log('⚠️ Errore caricamento prodotti da Supabase:', error.message);
                console.log('ℹ️ Uso prodotti locali');
                this.products = this.productsLocal.map(p => this.formatLocalProduct(p));
            } else if (data && data.length > 0) {
                // Carica da Supabase
                this.products = data.map(product => this.formatProduct(product));
                console.log(`✅ Caricati ${this.products.length} prodotti da Supabase`);
            } else {
                // Fallback a prodotti locali
                console.log('ℹ️ Nessun prodotto in Supabase, uso prodotti locali');
                this.products = this.productsLocal.map(p => this.formatLocalProduct(p));
            }
            
            this.filteredProducts = [...this.products];
            this.renderProducts();
            console.log(`📊 Totale prodotti caricati: ${this.products.length}`);
            
        } catch (error) {
            console.error('❌ Errore caricamento prodotti:', error);
            // Fallback definitivo
            this.products = this.productsLocal.map(p => this.formatLocalProduct(p));
            this.filteredProducts = [...this.products];
            this.renderProducts();
        }
    }

    // NUOVO: Formatta prodotto da Supabase
    formatProduct(dbProduct) {
        try {
            return {
                id: dbProduct.id,
                name: dbProduct.name,
                description: dbProduct.description,
                descrizioneApprofondita: dbProduct.descrizione_approfondita || dbProduct.description,
                basePrice: parseFloat(dbProduct.base_price) || 0,
                category: dbProduct.category,
                image: this.getProductImage(dbProduct),
                gallery: this.getProductGallery(dbProduct),
                customizations: this.parseJSONField(dbProduct.customizations),
                promotion: this.parsePromotion(dbProduct.promotion),
                featured: dbProduct.featured || false,
                stock: dbProduct.stock || 10,
                active: dbProduct.active !== false
            };
        } catch (error) {
            console.error('❌ Errore formattazione prodotto:', error);
            return this.createDefaultProduct();
        }
    }

    // NUOVO: Formatta prodotto locale
    formatLocalProduct(localProduct) {
        return {
            id: localProduct.id,
            name: localProduct.name,
            description: localProduct.description,
            descrizioneApprofondita: localProduct.descrizioneApprofondita || localProduct.description,
            basePrice: localProduct.basePrice,
            category: localProduct.category,
            image: localProduct.image,
            gallery: localProduct.gallery || [localProduct.image],
            customizations: localProduct.customizations || {},
            promotion: localProduct.promotion || { active: false, discount: 0 },
            featured: false,
            stock: 10,
            active: true
        };
    }

    // Helper methods
    getProductImage(product) {
        if (product.images && product.images.length > 0) {
            return product.images[0];
        }
        return 'https://via.placeholder.com/400x300/1e2a4a/00c6ff?text=MECO';
    }

    getProductGallery(product) {
        if (product.gallery && product.gallery.length > 0) {
            return product.gallery;
        }
        if (product.images && product.images.length > 0) {
            return product.images;
        }
        return [this.getProductImage(product)];
    }

    parseJSONField(field) {
        try {
            if (!field) return {};
            if (typeof field === 'string') return JSON.parse(field);
            return field;
        } catch {
            return {};
        }
    }

    parsePromotion(promotion) {
        try {
            const promo = this.parseJSONField(promotion);
            return {
                active: promo.active || false,
                discount: parseFloat(promo.discount) || 0,
                expires: promo.expires,
                label: promo.label || ''
            };
        } catch {
            return { active: false, discount: 0 };
        }
    }

    createDefaultProduct() {
        return {
            id: 'default-' + Date.now(),
            name: 'Prodotto di esempio',
            description: 'Prodotto di esempio',
            basePrice: 10.00,
            category: 'generale',
            image: 'https://via.placeholder.com/400x300/1e2a4a/00c6ff?text=MECO',
            gallery: ['https://via.placeholder.com/400x300/1e2a4a/00c6ff?text=MECO'],
            customizations: {},
            promotion: { active: false, discount: 0 },
            featured: false,
            stock: 10,
            active: true
        };
    }

    // RESTAURATO: Metodo per ottenere qualsiasi prodotto (prima locale, poi Supabase)
    getProductById(productId) {
        // Prima cerca nei prodotti caricati
        const supabaseProduct = this.products.find(p => p.id === productId);
        if (supabaseProduct) return supabaseProduct;
        
        // Poi cerca nei prodotti locali
        const localProduct = this.getLocalProductById(productId);
        if (localProduct) return this.formatLocalProduct(localProduct);
        
        console.warn(`⚠️ Prodotto ${productId} non trovato`);
        return null;
    }

    // RESTAURATO: Calcola prezzo scontato
    getDiscountedPrice(product) {
        if (!product) return 0;
        
        if (!product.promotion || !product.promotion.active) {
            return product.basePrice;
        }
        
        // Usa il metodo promotions dell'app per validare la promozione
        if (this.app.promotions && this.app.promotions.isPromotionValid) {
            if (!this.app.promotions.isPromotionValid(product.promotion)) {
                return product.basePrice;
            }
        }
        
        if (product.promotion.discount && product.promotion.discount > 0) {
            const discount = parseFloat(product.promotion.discount) || 0;
            return product.basePrice * (1 - discount / 100);
        }
        
        return product.basePrice;
    }

    // MODIFICATO: Renderizza i prodotti
    renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) {
            console.log('⏳ Container prodotti non trovato, riprovo tra 100ms...');
            setTimeout(() => this.renderProducts(), 100);
            return;
        }
        
        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 48px; color: var(--text-secondary); opacity: 0.5;"></i>
                    <h3 style="color: var(--text-secondary); margin-bottom: 10px;">Nessun prodotto trovato</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">
                        Prova con un'altra ricerca o filtro
                    </p>
                    <button class="glass-btn" onclick="document.querySelector('.filter-btn[data-category=\\'tutti\\']').click()">
                        <span>Mostra tutti i prodotti</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredProducts.map(product => this.getProductHTML(product)).join('');
        this.addProductEventListeners();
    }

    // MODIFICATO: Genera HTML prodotto
    getProductHTML(product) {
        const hasPromo = product.promotion?.active;
        const finalPrice = this.getDiscountedPrice(product);
        const promoPercentage = hasPromo ? product.promotion.discount : 0;
        
        // Trova il prodotto locale corrispondente per avere più dettagli
        const localProduct = this.getLocalProductById(product.id);
        const detailedProduct = localProduct || product;
        
        return `
            <div class="product-card ${hasPromo ? 'promo-card' : ''}" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x300/1e2a4a/00c6ff?text=MECO'">
                    
                    ${hasPromo ? `
                    <div class="product-promo-badge">
                        <i class="fas fa-fire"></i> ${promoPercentage}% OFF
                    </div>
                    ` : ''}
                    
                    <button class="favorite-btn" data-id="${product.id}" title="Aggiungi ai preferiti">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                
                <div class="product-info">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <span class="product-category">${getCategoryLabel(product.category)}</span>
                        ${product.featured ? `
                        <span style="background: rgba(255, 193, 7, 0.1); color: #FFC107; padding: 4px 8px; border-radius: 12px; font-size: 11px;">
                            <i class="fas fa-star"></i> In evidenza
                        </span>
                        ` : ''}
                    </div>
                    
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div style="margin-top: auto;">
                        <div class="product-price">
                            ${hasPromo ? `
                            <div>
                                <span class="original-price">€${product.basePrice.toFixed(2)}</span>
                                <span class="promo-price">€${finalPrice.toFixed(2)}</span>
                            </div>
                            ` : `
                            <div>€${product.basePrice.toFixed(2)}</div>
                            `}
                        </div>
                        
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <button class="glass-btn view-details-btn" data-id="${product.id}" 
                                    style="flex: 1; padding: 12px; font-size: 14px;">
                                <span>Dettagli</span>
                                <i class="fas fa-eye"></i>
                            </button>
                            
                            <button class="glass-btn btn-secondary add-to-cart-btn" 
                                    data-id="${product.id}"
                                    style="padding: 12px; min-width: 44px;"
                                    title="Aggiungi al carrello">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // NUOVO: Aggiunge event listener ai prodotti
    addProductEventListeners() {
        // Bottoni dettagli
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                if (this.app.modal && this.app.modal.openProductModal) {
                    this.app.modal.openProductModal(productId);
                }
            });
        });

        // Bottoni aggiungi al carrello
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                if (this.app.cart && this.app.cart.addItem) {
                    this.app.cart.addItem(productId, 1);
                }
            });
        });

        // Bottoni preferiti
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                if (this.app.favorites && this.app.favorites.toggleFavorite) {
                    this.app.favorites.toggleFavorite(productId);
                }
            });
        });
    }

    // RESTAURATO: Filtra prodotti
    filterProducts(category, searchTerm = '') {
        console.log('🔍 Filtro prodotti:', { category, searchTerm });
        
        let filtered = [...this.products];
        
        // Filtro per categoria
        if (category && category !== 'tutti') {
            if (category === 'incisioni') {
                filtered = filtered.filter(p => 
                    this.productsLocal.filter(lp => lp.id === p.id && productsData.incisioni.includes(lp)).length > 0
                );
            } else if (category === 'stampe3d') {
                filtered = filtered.filter(p => 
                    this.productsLocal.filter(lp => lp.id === p.id && productsData.stampe3d.includes(lp)).length > 0
                );
            } else if (category === 'promozioni') {
                filtered = filtered.filter(p => p.promotion?.active);
            }
        }
        
        // Filtro per ricerca
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term)
            );
        }
        
        this.filteredProducts = filtered;
        this.renderProducts();
    }

    // RESTAURATO: Mostra prodotti (per compatibilità)
    displayProducts(type = 'tutti', searchTerm = '') {
        this.filterProducts(type, searchTerm);
    }

    // RESTAURATO: Ottieni HTML per galleria
    getGalleryHTML(gallery, product) {
        if (!gallery || gallery.length === 0) {
            return '';
        }
        
        return gallery.map((img, index) => `
            <div class="gallery-thumb ${index === 0 ? 'active' : ''}" 
                 data-image="${img}"
                 style="border-color: ${index === 0 ? 'var(--accent-color)' : 'transparent'};">
                <img src="${img}" alt="${product.name} - immagine ${index + 1}"
                     onerror="this.src='https://via.placeholder.com/80/1e2a4a/00c6ff?text=Image'">
            </div>
        `).join('');
    }

    // RESTAURATO: Ottieni HTML per personalizzazioni
    getCustomizationsHTML(customizations) {
        if (!customizations || Object.keys(customizations).length === 0) {
            return '<p style="color: var(--text-secondary); font-style: italic;">Nessuna personalizzazione disponibile per questo prodotto.</p>';
        }
        
        let html = '';
        
        Object.entries(customizations).forEach(([key, value], index) => {
            if (Array.isArray(value)) {
                // Opzioni predefinite
                html += `
                    <div style="margin-bottom: ${index < Object.keys(customizations).length - 1 ? '20px' : '0'};">
                        <label style="display: block; margin-bottom: 10px; color: var(--text-color); font-weight: 500;">
                            ${this.formatCustomizationKey(key)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${value.map((option, i) => `
                                <button type="button" 
                                        class="customization-option"
                                        data-customization="${key}"
                                        data-value="${option}"
                                        data-price="0"
                                        style="${i === 0 ? 'background: var(--accent-color); border-color: var(--accent-color); color: white;' : ''}">
                                    ${option}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (typeof value === 'string' && value.includes('maxlength')) {
                // Campo testo
                const maxLength = value.split(':')[1] || 100;
                html += `
                    <div style="margin-bottom: ${index < Object.keys(customizations).length - 1 ? '20px' : '0'};">
                        <label style="display: block; margin-bottom: 10px; color: var(--text-color); font-weight: 500;">
                            ${this.formatCustomizationKey(key)}
                        </label>
                        <input type="text" 
                               id="custom-text-${key}"
                               class="customization-input"
                               placeholder="Inserisci il testo..."
                               maxlength="${maxLength}"
                               style="width: 100%;">
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">
                            Massimo ${maxLength} caratteri
                        </div>
                    </div>
                `;
            } else if (typeof value === 'object' && value !== null) {
                // Oggetto complesso (dai tuoi dati)
                if (value.label && value.options) {
                    // Opzioni con prezzi
                    html += `
                        <div style="margin-bottom: ${index < Object.keys(customizations).length - 1 ? '20px' : '0'};">
                            <label style="display: block; margin-bottom: 10px; color: var(--text-color); font-weight: 500;">
                                ${value.label}
                            </label>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                ${value.options.map((option, i) => `
                                    <button type="button" 
                                            class="customization-option"
                                            data-customization="${key}"
                                            data-value="${option.name}"
                                            data-price="${option.price || 0}"
                                            style="${i === 0 ? 'background: var(--accent-color); border-color: var(--accent-color); color: white;' : ''}">
                                        ${option.name} ${option.price > 0 ? `(+€${option.price.toFixed(2)})` : ''}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `;
                } else if (value.type === 'text') {
                    // Campo testo da oggetto
                    html += `
                        <div style="margin-bottom: ${index < Object.keys(customizations).length - 1 ? '20px' : '0'};">
                            <label style="display: block; margin-bottom: 10px; color: var(--text-color); font-weight: 500;">
                                ${value.label || key}
                            </label>
                            <input type="text" 
                                   id="custom-text-${key}"
                                   class="customization-input"
                                   placeholder="${value.label || 'Inserisci testo'}"
                                   maxlength="${value.maxLength || 100}"
                                   style="width: 100%;">
                        </div>
                    `;
                }
            }
        });
        
        return html;
    }

    formatCustomizationKey(key) {
        const words = key.replace(/_/g, ' ').split(' ');
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Altri metodi utili
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    getPromotionalProducts() {
        return this.products.filter(product => 
            product.promotion?.active && 
            (!this.app.promotions || this.app.promotions.isPromotionValid(product.promotion))
        );
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    searchProducts(term) {
        const searchTerm = term.toLowerCase().trim();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
}

console.log('✅ ProductsManager esportato correttamente');