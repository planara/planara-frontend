// Core
import { useState } from 'react';
// Routing
import { useNavigate } from 'react-router-dom';
// Icons
import {
  ArrowLeftRegular,
  BeakerRegular,
  PlayRegular,
  SparkleRegular,
} from '@fluentui/react-icons';
// Types
import { BenchmarkTestType } from '@planara/types';
import {
  AlertPosition,
  AlertStatus,
  UiButtonSize,
  UiButtonVariant,
  UiIconBoxVariant,
} from '@/types';
// Components
import { AppShell, UiButton, UiIconBox, UiPageHero, BenchmarkAboutMetrics } from '@/components';
// Hooks
import { useAlerts } from '@/hooks';
// Shared
import {
  benchmarkTests,
  createBenchmarkRunUrl,
  DEFAULT_BENCHMARK_DURATION_MS,
  routeNames,
} from '@/shared';

export const CreateBenchmarkRunPage = () => {
  const navigate = useNavigate();

  const { addAlert } = useAlerts();

  const [selectedTests, setSelectedTests] = useState<BenchmarkTestType[]>([
    BenchmarkTestType.Light,
    BenchmarkTestType.Medium,
  ]);
  const [durationMs, setDurationMs] = useState(DEFAULT_BENCHMARK_DURATION_MS);

  const toggleTest = (type: BenchmarkTestType) => {
    setSelectedTests((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      }

      return [...prev, type];
    });
  };

  const selectAllTests = () => {
    setSelectedTests(benchmarkTests.map((test) => test.type));
  };

  const resetSelection = () => {
    setSelectedTests([]);
  };

  const startBenchmark = () => {
    if (selectedTests.length === 0) {
      addAlert('Выберите хотя бы один тест', AlertStatus.Error, AlertPosition.TopRight);
      return;
    }

    if (!durationMs || durationMs < 1000) {
      addAlert(
        'Минимальная длительность теста — 1000 мс',
        AlertStatus.Error,
        AlertPosition.TopRight,
      );
      return;
    }

    navigate(createBenchmarkRunUrl(selectedTests, durationMs));
  };

  return (
    <AppShell>
      <main className="benchmark-create-page">
        <section className="benchmark-create-hero">
          <UiButton
            title="Запуски"
            size={UiButtonSize.Medium}
            variant={UiButtonVariant.Light}
            icon={<ArrowLeftRegular />}
            onClick={() => navigate(routeNames.BENCHMARK_RUNS_PAGE)}
          >
            Запуски
          </UiButton>

          <UiPageHero
            badgeIcon={<SparkleRegular />}
            badge="Новый бенчмарк"
            title="Создание запуска тестирования"
            subtitle="Выберите один или несколько сценариев нагрузки, задайте длительность и перейдите в отдельный режим выполнения тестов."
          ></UiPageHero>
        </section>

        <section className="benchmark-create-layout">
          <section className="benchmark-create-card benchmark-create-card--main">
            <div className="benchmark-create-card__header">
              <div>
                <p className="benchmark-create-section__eyebrow">Тесты</p>
                <h2 className="benchmark-create-card__title">Сценарии нагрузки</h2>
              </div>

              <span className="benchmark-create-card__count">{selectedTests.length} выбрано</span>
            </div>

            <div className="benchmark-create-tests">
              {benchmarkTests.map((test) => {
                const selected = selectedTests.includes(test.type);

                return (
                  <button
                    key={test.type}
                    className={[
                      'benchmark-create-test',
                      selected ? 'benchmark-create-test--selected' : '',
                    ].join(' ')}
                    type="button"
                    onClick={() => toggleTest(test.type)}
                  >
                    <span className="benchmark-create-test__check">{selected ? '✓' : ''}</span>

                    <span className="benchmark-create-test__content">
                      <span className="benchmark-create-test__title">{test.title}</span>
                      <span className="benchmark-create-test__description">{test.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="benchmark-create-card__actions">
              <UiButton type="button" onClick={selectAllTests} variant={UiButtonVariant.Light}>
                Выбрать все
              </UiButton>

              <UiButton type="button" onClick={resetSelection} variant={UiButtonVariant.Light}>
                Снять выбор
              </UiButton>

              <UiButton
                icon={<PlayRegular />}
                type="button"
                onClick={startBenchmark}
                variant={UiButtonVariant.Dark}
              >
                Запустить тестирование
              </UiButton>
            </div>
          </section>

          <aside className="benchmark-create-sidebar">
            <section className="benchmark-create-card">
              <div className="benchmark-create-card__header">
                <div>
                  <p className="benchmark-create-section__eyebrow">Параметры</p>
                  <h2 className="benchmark-create-card__title">Длительность</h2>
                </div>

                <UiIconBox icon={<BeakerRegular />} variant={UiIconBoxVariant.Dark} />
              </div>

              <label className="benchmark-create-duration">
                <span>Длительность одного теста</span>

                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={durationMs}
                  onChange={(event) => setDurationMs(Number(event.target.value))}
                />

                <small>Значение указывается в миллисекундах.</small>
              </label>
            </section>

            <BenchmarkAboutMetrics />
          </aside>
        </section>
      </main>
    </AppShell>
  );
};

export default CreateBenchmarkRunPage;
