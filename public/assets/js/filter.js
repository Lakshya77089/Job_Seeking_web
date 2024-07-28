document.addEventListener('DOMContentLoaded', () => {
    const priceRange = document.querySelector('.price_rangs_aside');
    const priceInputFrom = document.querySelector('.js-input-from');
    const priceInputTo = document.querySelector('.js-input-to');
    const jobsContainer = document.querySelector('.job-listing-area');
    const jobs = jobsContainer.querySelectorAll('.single-job-items');
  
    if (priceRange && priceInputFrom && priceInputTo && jobs) {
      const minPrice = Math.min(...Array.from(jobs, job => parseInt(job.dataset.price)));
      const maxPrice = Math.max(...Array.from(jobs, job => parseInt(job.dataset.price)));
  
      noUiSlider.create(priceRange, {
        start: [minPrice, maxPrice],
        connect: true,
        tooltips: [true, true],
        range: {
          'min': minPrice,
          'max': maxPrice
        }
      });
  
      priceRange.noUiSlider.on('update', (values, handle) => {
        const [from, to] = values;
        priceInputFrom.value = from;
        priceInputTo.value = to;
  
        // Filter jobs based on the selected price range
        jobs.forEach(job => {
          const price = parseInt(job.dataset.price);
          if (price >= from && price <= to) {
            job.style.display = 'block';
          } else {
            job.style.display = 'none';
          }
        });
      });
    }
  });