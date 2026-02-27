# Vercel Build Framer Motion Type Error Çözümü

Bu problem TypeScript'in obje özelliklerini genişleterek (`widening`) yorumlamasından kaynaklanıyor. 
Framer Motion'ın `Variants` tipi `ease` için string sabiti (örneğin `"easeOut"`) beklerken, TypeScript objenin içindeki string'i direkt olarak genel bir `string` tipinde algılar. `Variants` tipinde bir index imzası kullanıldığı için tam olarak bu string sabitini türetemez.

## Hata Neden Oluştu?

```tsx
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    // TypeScript buradaki "easeOut" değerini Easing sabiti olarak değil,
    // genel bir 'string' tipinde infer (türetim) eder. 
    // Types of property 'ease' are incompatible: Type 'string' is not assignable to type 'Easing'.
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}
```

## Çözüm (`as const` Kullanımı)

Bu sorunu çözmek için bu string'in değişmez ve tam olarak `"easeOut"` bir sabit olduğunu TypeScript'e `as const` kullanarak belirtebiliriz:

```tsx
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    // "as const" ile TypeScript tipin tam olarak `"easeOut"` kelimesi olduğunu anlar 
    // ve framer-motion tip tanımlamaları (Easing) ile sorunsuz eşleşir.
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
}
```

Bu küçük değişiklik `src/components/landing/LandingClient.tsx` dosyasında gerçekleştirilmiş olup tip uyuşmazlığını giderdi. Build'inizi artık başarılı bir şekilde alabilirsiniz.
