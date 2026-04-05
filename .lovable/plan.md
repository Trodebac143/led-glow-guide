

## Plan: Rediseño de esquemas SVG — Representación lineal sin lazo de retorno

### Objetivo
Eliminar el lazo inferior de retorno en ambos circuitos y reemplazarlo con una representación lineal técnica: terminal +V a la izquierda, GND a la derecha, sin circuito cerrado dibujado.

### Archivos a modificar
- `src/components/SeriesCircuit.tsx`
- `src/components/ParallelCircuit.tsx`

No se toca `ledCalculator.ts`, `Index.tsx` ni las props.

---

### Serie — Nueva representación

```text
+{voltage}V ──[R]──►|──►|──►|── ⏚ GND
```

Cambios concretos:
1. **Eliminar el bloque "Return wire"** (líneas 94-107) — el lazo inferior desaparece por completo.
2. **Reemplazar el símbolo de fuente circular** por un terminal simple: una línea vertical corta con etiqueta `+{voltage}V` encima.
3. **Añadir terminal GND a la derecha** tras el último LED: línea vertical corta con etiqueta `GND` y símbolo de masa (tres líneas horizontales decrecientes).
4. **Reducir `totalHeight`** a ~100px ya que no hay retorno inferior, solo la línea central.
5. **Mantener intactos**: resistencia, LEDs (triángulo + barra + rayos), etiquetas LED1..N, ellipsis, current flow arrow, colores y strokeColor/textColor.
6. El cable final del último LED se extiende limpiamente hasta el terminal GND.

### Paralelo — Nueva representación

```text
+V bus (vertical izq)     GND bus (vertical der)
    ├──[R]──►|──┤
    ├──[R]──►|──┤
    ├──[R]──►|──┤
```

Cambios concretos:
1. **Eliminar el bloque "Return to source"** (líneas 46-57) — sin lazo inferior.
2. **Reemplazar la fuente circular** por un terminal/etiqueta `+{voltage}V` en la parte superior del bus izquierdo.
3. **Añadir etiqueta `GND`** en la parte superior del bus derecho con símbolo de masa.
4. **Los buses verticales** (izquierdo = +V, derecho = GND) se extienden solo desde la primera hasta la última rama, sin prolongarse más abajo.
5. **Reducir `totalHeight`** eliminando los 80px extra del retorno.
6. **Mantener intactos**: ramas con resistencia + LED, etiquetas LED1..N, ellipsis, colores.

### Detalles de estilo compartidos
- Terminal +V: línea vertical corta (~12px) con punto/nodo, etiqueta `+{voltage}V` arriba.
- Terminal GND: línea vertical corta con tres líneas horizontales decrecientes (símbolo estándar de masa) y etiqueta `GND`.
- Mismos colores: `strokeColor`, `textColor`, `ledColor` de props.
- SVG responsive con viewBox dinámico.

