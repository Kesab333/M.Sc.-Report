/* ==========================================================================
   APP.JS (v2) - Core Logic for MSc Thesis Website
   Contains: Theme/Size Accessibility, Sidebar, Simulator, & Calculator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ACCESSIBILITY CONTROLS (Theme Toggle & Sidebar Integration) ---
    const btnTheme = document.getElementById('btn-theme');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    
    let textScale = 1.0;
    
    // Check local storage for theme preference, default is LIGHT (no dark-mode class)
    const activeTheme = localStorage.getItem('theme');
    if (activeTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }

    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    function updateThemeIcon(isDark) {
        if (!btnTheme) return;
        const themeIcon = btnTheme.querySelector('.theme-icon');
        const themeText = btnTheme.querySelector('.theme-text');
        
        if (themeIcon && themeText) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
            themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        } else {
            // Fallback for simple button
            btnTheme.textContent = isDark ? '☀️' : '🌙';
        }
        btnTheme.setAttribute('data-tooltip', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Font Resizing (A+ / A-) - Safely wrap in null checks
    if (btnZoomIn) {
        btnZoomIn.addEventListener('click', () => {
            if (textScale < 1.3) {
                textScale += 0.08;
                document.documentElement.style.setProperty('--text-scale', textScale.toString());
            }
        });
    }

    if (btnZoomOut) {
        btnZoomOut.addEventListener('click', () => {
            if (textScale > 0.8) {
                textScale -= 0.08;
                document.documentElement.style.setProperty('--text-scale', textScale.toString());
            }
        });
    }

    // --- 2. SIDEBAR ACTIVE LINK TRACKING (Intersection Observer) ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.querySelector('a').getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // --- 3. DYNAMIC GLASS DOPING SIMULATOR ---
    const simSlider = document.getElementById('sim-slider');
    const tickLabels = document.querySelectorAll('.tick-label');
    const glassDisc = document.getElementById('glass-disc');
    const sampleImg = document.getElementById('sample-img');
    const sliderXVal = document.getElementById('slider-x-val');
    
    // Metric Fields
    const valFormula = document.getElementById('val-formula');
    const valDensity = document.getElementById('val-density');
    const valMolarVol = document.getElementById('val-molar-vol');
    const valBandGap = document.getElementById('val-band-gap');
    const valOpd = document.getElementById('val-opd');
    const valOmv = document.getElementById('val-omv');
    const valRole = document.getElementById('val-role');
    const valDesc = document.getElementById('val-desc');

    // Experimental data array for slider steps [0%, 1.0%, 1.5%, 2.0%]
    const dopingData = {
        "0": {
            displayX: "0.0",
            formula: "35SiO₂ - 30B₂O₃ - 35Na₂O",
            density: "2.4506",
            molarVol: "25.9572",
            bandGap: "2.71",
            opd: "45.24",
            omv: "13.3114",
            role: "Base Glass Matrix",
            desc: "Clean, colorless glass network without dopants. Boron is distributed between BO₃ triangles and charge-balanced BO₄ tetrahedra. Serves as reference host.",
            discColor: "rgba(224, 242, 254, 0.25)",
            discGlow: "rgba(8, 145, 178, 0.15)",
            samplePhoto: "Fig\\Sample\\0.jpeg" // Overall photo showing the whole series
        },
        "1": {
            displayX: "1.0",
            formula: "35SiO₂ - 30B₂O₃ - 34Na₂O - 1V₂O₅",
            density: "2.4565",
            molarVol: "26.3827",
            bandGap: "2.59",
            opd: "45.42",
            omv: "13.2576",
            role: "Network Former (Dominant)",
            desc: "Vanadium pentoxide integrates as network-forming VO₄/VO₅ polyhedra. This creates cross-linkages and compacts the atomic structure, resulting in an initial density rise to 2.4565 g/cm³.",
            discColor: "rgba(254, 240, 138, 0.45)",
            discGlow: "rgba(217, 119, 6, 0.2)",
            samplePhoto: "Fig/Sample/1.jpeg" // Actual photo of the 1mol% glass sample
        },
        "1.5": {
            displayX: "1.5",
            formula: "35SiO₂ - 30B₂O₃ - 33.5Na₂O - 1.5V₂O₅",
            density: "2.4483",
            molarVol: "26.7156",
            bandGap: "2.50",
            opd: "45.31",
            omv: "13.2914",
            role: "Network Modifier (Dominant)",
            desc: "At this composition, vanadium acts heavily as a modifier, breaking bridging bonds (Si-O-B) and creating Non-Bridging Oxygens (NBOs). This depolymerizes the network, leading to structural expansion, density drop, and the lowest band gap (2.50 eV) due to defect states.",
            discColor: "rgba(245, 158, 11, 0.65)",
            discGlow: "rgba(217, 119, 6, 0.35)",
            samplePhoto: "Fig/Sample/1.5.jpeg" // Actual photo of the 1.5mol% glass sample
        },
        "2": {
            displayX: "2.0",
            formula: "35SiO₂ - 30B₂O₃ - 33Na₂O - 2V₂O₅",
            density: "2.4547",
            molarVol: "26.8902",
            bandGap: "2.55",
            opd: "45.46",
            omv: "13.2464",
            role: "Former/Modifier Equilibrium",
            desc: "A complex structural equilibrium is reached. Vanadium begins to reorganize the network, forming new conditional V-O-V bridging links. This partially restores network connectivity, raising density and leading to a slight band gap recovery.",
            discColor: "rgba(180, 83, 9, 0.85)",
            discGlow: "rgba(180, 83, 9, 0.45)",
            samplePhoto: "Fig/Sample/2.jpeg" // Actual photo of the 2mol% glass sample
        }
    };

    function updateSimulator(stepValue) {
        const stepKey = stepValue.toString();
        const data = dopingData[stepKey];
        if (!data) return;

        // Update labels & texts
        sliderXVal.textContent = data.displayX;
        valFormula.textContent = data.formula;
        valDensity.textContent = data.density;
        valMolarVol.textContent = data.molarVol;
        valBandGap.textContent = data.bandGap;
        valOpd.textContent = data.opd;
        valOmv.textContent = data.omv;
        valRole.textContent = data.role;
        valDesc.textContent = data.desc;

        // Update Disc Styles
        document.documentElement.style.setProperty('--glass-disc-color', data.discColor);
        document.documentElement.style.setProperty('--glass-disc-glow', data.discGlow);

        // Update Sample Photograph
        sampleImg.src = data.samplePhoto;
        sampleImg.alt = `Photograph of ${data.displayX} mol% Glass Sample`;

        // Update active tick state
        tickLabels.forEach(label => {
            if (label.getAttribute('data-val') === stepValue.toString()) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }

    simSlider.addEventListener('input', (e) => {
        // Map slider values (0, 1, 2, 3) to step keys (0, 1, 1.5, 2)
        const valMap = ["0", "1", "1.5", "2"];
        const stepVal = valMap[e.target.value];
        updateSimulator(stepVal);
    });

    tickLabels.forEach(label => {
        label.addEventListener('click', () => {
            const stepVal = label.getAttribute('data-val');
            const sliderVal = ["0", "1", "1.5", "2"].indexOf(stepVal);
            simSlider.value = sliderVal;
            updateSimulator(stepVal);
        });
    });

    // Initialize simulator with first step (0 mol%)
    updateSimulator("0");

    // --- 4. RESULTS & SPECTRUM TAB SYSTEM ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 5. SCIENTIFIC DERIVED PARAMETER CALCULATOR ---
    const calcInput = document.getElementById('calc-x');
    const calcBtn = document.getElementById('calc-btn');
    const calcPlaceholder = document.getElementById('calc-placeholder');
    const calcDisplay = document.getElementById('calc-display');

    // Outputs
    const outMw = document.getElementById('out-mw');
    const outOatoms = document.getElementById('out-oatoms');
    const outDensity = document.getElementById('out-density');
    const outMolarVol = document.getElementById('out-molar-vol');
    const outOpd = document.getElementById('out-opd');
    const outOmv = document.getElementById('out-omv');

    calcBtn.addEventListener('click', () => {
        const x = parseFloat(calcInput.value);

        // Validation: Must be a number between 0 and 2.0
        if (isNaN(x) || x < 0 || x > 2.0) {
            alert('Please enter a valid V₂O₅ concentration between 0.0 and 2.0 mol%.');
            return;
        }

        // --- CALCULATIONS BASED ON EXPERIMENTAL DATA REGRESSIONS ---
        
        // 1. Molecular Weight (M)
        // M = 63.607 + 1.199 * x (g/mol)
        const mw = 63.607 + 1.199 * x;

        // 2. Total Oxygen atoms per formula unit n(O)
        // n(O) = 1.95 + 0.04 * x
        const nO = 1.95 + 0.04 * x;

        // 3. Predicted Density (ρ) using our validated cubic interpolation model:
        // ρ(x) = 0.0220333 * x^3 - 0.06995 * x^2 + 0.0538167 * x + 2.4506 (g/cm^3)
        const density = 0.0220333 * Math.pow(x, 3) - 0.06995 * Math.pow(x, 2) + 0.0538167 * x + 2.4506;

        // 4. Molar Volume (Vm) = M / ρ
        const molarVol = mw / density;

        // 5. Oxygen Packing Density (OPD) = 1000 * ρ * n(O) / M
        const opd = 1000 * (density * nO) / mw;

        // 6. Oxygen Molar Volume (Vo) = Vm / n(O)
        const omv = molarVol / nO;

        // Update display UI
        outMw.textContent = mw.toFixed(4);
        outOatoms.textContent = nO.toFixed(3);
        outDensity.textContent = density.toFixed(4);
        outMolarVol.textContent = molarVol.toFixed(4);
        outOpd.textContent = opd.toFixed(2);
        outOmv.textContent = omv.toFixed(4);

        // Transition views
        calcPlaceholder.style.display = 'none';
        calcDisplay.style.display = 'flex';
        
        // Add tiny entrance pulse animation
        calcDisplay.style.animation = 'none';
        setTimeout(() => {
            calcDisplay.style.animation = 'fadeIn 0.3s ease-out';
        }, 10);
    });

    // Mobile Navbar toggler for narrow screens
    const logoIcon = document.querySelector('.logo-icon');
    const navLinks = document.querySelector('.nav-links');
    if (logoIcon) {
        logoIcon.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                navLinks.classList.toggle('mobile-show');
            }
        });
    }
});
