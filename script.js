gsap.registerPlugin(ScrollTrigger, Draggable);
window.addEventListener("DOMContentLoaded", () => {
  gsap.from("body", { autoAlpha: 0, duration: 1, ease: "linear" }),
    gsap.to(":root", {
      duration: 1,
      ease: "power1.out",
    });
});
barba.init({
  preventRunning: !0,
  views: [
    {
      namespace: "linktree",
      beforeEnter(r) {
        let swiper = r.next.container;
        new Carrousel(swiper), new c(swiper);
      },
    },
  ],
});

let initWidth = null;
initDrag = [];
class Carrousel {
  constructor(swiper) {
    this.initProps(swiper), this.setScrollTrigger(), this.setInitAnim();
  }
  initProps(swiper) {
    (this.instance = 0),
      (this.spacing = 0.17),
      (this.snapDuration = gsap.utils.snap(this.spacing)),
      (this.cards = [...swiper.querySelectorAll(".links-ct-itm")]),
      (this.cardsList = swiper.querySelector(".links-ct")),
      (this.cardsListWrapper = swiper.querySelector(".links-ct-wrp")),
      (this.cardsTotal = this.cards.length),
      (this.sectionWrapper = swiper.querySelector("[visibility-hidden]")),
      (this.infiniteLoop = this.buildInfiniteLoop(
        this.cards,
        this.spacing,
        this.animFunc.bind(this)
      )),
      (this.playHead = { offset: 0 }),
      (this.scroll = null),
      (initWidth = () => this.scrollToOffset(this.scrub.vars.offset));
  }
  setScrollTrigger() {
    (this.trigger = ScrollTrigger.create({
      start: 0,
      end: `+=${this.cardsTotal * 4 * 100}`,
      onUpdate: this.onScrollUpdate.bind(this),
      pin: this.cardsListWrapper,
      pinType: "fixed",
    })),
      ScrollTrigger.addEventListener("scrollEnd", initWidth);
  }
  setInitAnim() {
    gsap.set(this.cards, { x: "125%", opacity: 0, scale: 0 }),
      gsap.from(this.sectionWrapper, {
        autoAlpha: 0,
        ease: "expo",
        duration: 1,
      }),
      (this.scrub = gsap.to(this.playHead, {
        offset: 0,
        onUpdate: this.onScrubUpdate.bind(this),
        ease: "power3",
        duration: 0.5,
        paused: !0,
      })),
      window.scroll(0, 1),
      this.draggable();
  }
  animFunc(swiper) {
    const swipe = gsap.timeline();
    return (
      swipe
        .fromTo(
          swiper,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            zIndex: 100,
            duration: 0.5,
            ease: "power1.in",
            repeat: 1,
            yoyo: !0,
            immediateRender: !1,
          }
        )
        .fromTo(
          swiper,
          { x: "125vw" },
          { x: "-125vw", ease: "none", duration: 1, immediateRender: !1 },
          0
        ),
      swipe
    );
  }
  buildInfiniteLoop(swiper, swipe, looper) {
    let s = gsap.timeline({ paused: !0 }),
      o = gsap.timeline({
        repeat: -1,
        paused: !0,
        onRepeat: () => {
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        },
        onReverseComplete: () => {
          this.totalTime(this.rawTime() + this.duration() * 100);
        },
      }),
      a = swipe * swiper.length,
      n;
    return (
      swiper
        .concat(swiper)
        .concat(swiper)
        .forEach((y, d) => {
          let l = looper(swiper[d % swiper.length]);
          s.add(l, d * swipe), n || (n = l.duration());
        }),
      o.fromTo(
        s,
        { time: a + n / 2 },
        { time: "+=" + a, duration: a, ease: "none" }
      ),
      o
    );
  }
  onScrubUpdate() {
    const swiper = gsap.utils.wrap(0, this.infiniteLoop.duration());
    this.infiniteLoop.time(swiper(this.playHead.offset));
  }
  onScrollUpdate(swiper) {
    const swipe = swiper.scroll();
    if (swipe > swiper.end - 1) this.wrap(1, 2);
    else if (swipe < 1 && swiper.direction < 0) this.wrap(-1, swiper.end - 2);
    else {
      const looper =
        (this.instance + swiper.progress) * this.infiniteLoop.duration();
      looper !== this.scrub.vars.offset &&
        ((this.scrub.vars.offset = looper), this.scrub.invalidate().restart());
    }
  }
  scrollToOffset(swiper) {
    const looper =
      (this.snapDuration(swiper) -
        this.infiniteLoop.duration() * this.instance) /
      this.infiniteLoop.duration();
    if (
      ((this.scroll = this.progressToScroll(looper)), looper >= 1 || looper < 0)
    ) {
      this.wrap(Math.floor(looper), this.scroll);
      return;
    }
    this.trigger.scroll(this.scroll);
  }
  progressToScroll(swiper) {
    return gsap.utils.clamp(
      1,
      this.trigger.end - 1,
      gsap.utils.wrap(0, 1, swiper) * this.trigger.end
    );
  }
  wrap(swiper, swipe) {
    (this.instance += swiper),
      this.trigger.scroll(swipe),
      this.trigger.update();
  }
  draggable() {
    let swiper = this.scrub,
      swipe = this.cardsList,
      looper = this.scrollToOffset.bind(this);
    initDrag = Draggable.create(".drag-wrp", {
      type: "x",
      trigger: swipe,
      onPress() {
        this.startOffset = swiper.vars.offset;
      },
      onDrag() {
        (swiper.vars.offset =
          this.startOffset + (this.startX - this.x) * 0.001),
          swiper.invalidate().restart();
      },
      onDragEnd() {
        looper(swiper.vars.offset);
      },
    });
  }
}
