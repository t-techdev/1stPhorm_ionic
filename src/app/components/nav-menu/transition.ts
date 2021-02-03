import { Animation } from '@ionic/core';

export function menuEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
  wrapperAnimation.beforeStyles({'opacity': 1});

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .fromTo('translateY', '20%', '0%')
    .fromTo('opacity', '0', '1')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation)
  );

}

export function menuExitAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .fromTo('translateY', '0%', '10%')
    .fromTo('opacity', '1', '0')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation)
  );

}
