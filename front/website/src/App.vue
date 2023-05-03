<template>
  <div class="squire" ref="squire">Hello</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const squire = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('squire-animation');
        return
      }
      entry.target.classList.remove('squire-animation');
    });
  });

  observer.observe(squire.value);
})
</script>

<style scoped>
.squire {
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background: lightgray;
  position: absolute;
}

.squire-animation {
  animation: wipe-enter 3s;
}

@keyframes wipe-enter {
	0% {
		transform: scale(0, .025);
	}
	50% {
		transform: scale(1, .025);
	}
}
</style>
