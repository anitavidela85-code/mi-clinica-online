import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    // Animación 1: Abajo hacia Arriba (Solicitada)
    transition('* <=> slideUp', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ top: '100%' }) // Empieza abajo
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ top: '-100%' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ top: '0%' }))
        ], { optional: true })
      ]),
    ]),
    // Animación 2: Fade In (Transición suave)
    transition('* <=> fadeIn', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1 }))
        ], { optional: true })
      ]),
    ])
  ]);