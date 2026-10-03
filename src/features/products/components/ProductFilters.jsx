import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../components/ui/Input.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { Button } from '../../../components/ui/Button.jsx';

const EMPTY_FILTERS = {
  q: '',
  category_id: '',
  type: '',
  price_min: '',
  price_max: '',
  availability: false,
  onOffer: false,
};

function normalize(filters) {
  return {
    q: filters?.q ?? '',
    category_id: filters?.category_id ?? '',
    type: filters?.type ?? '',
    price_min: filters?.price_min ?? '',
    price_max: filters?.price_max ?? '',
    availability: filters?.availability === '1',
    onOffer: filters?.onOffer === '1',
  };
}

const TYPE_OPTIONS = ['stone', 'meteorite', 'jewelry'];

export function ProductFilters({
  active,
  categories = [],
  isLoadingCategories = false,
  onApply,
  onReset,
  onClose,
  showSearch = true,
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(() => normalize(active));

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply({
      ...draft,
      q: draft.q.trim(),
      availability: draft.availability ? '1' : '',
      onOffer: draft.onOffer ? '1' : '',
    });
    onClose?.();
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    onReset?.();
    onClose?.();
  };

  const categoryOptions = isLoadingCategories
    ? []
    : categories.map((category) => ({ value: category.id, label: category.name }));

  const typeOptions = [
    { value: '', label: t('products:filters.all') },
    ...TYPE_OPTIONS.map((type) => ({ value: type, label: t(`products:types.${type}`) })),
  ];

  const checkboxClass =
    'size-4 shrink-0 rounded border-border-300 text-primary-500 focus:ring-primary-500/40 focus:ring-2';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {showSearch && (
        <Input
          type="search"
          label={t('products:filters.search')}
          value={draft.q}
          onChange={(event) => update({ q: event.target.value })}
          placeholder={t('products:filters.search')}
        />
      )}

      <Select
        label={t('products:filters.category')}
        value={draft.category_id}
        onChange={(event) => update({ category_id: event.target.value })}
        options={categoryOptions}
        placeholder={t('products:filters.all')}
      />

      <Select
        label={t('products:filters.type')}
        value={draft.type}
        onChange={(event) => update({ type: event.target.value })}
        options={typeOptions}
      />

      <fieldset>
        <legend className="text-sm font-medium text-base-dark">
          {t('products:filters.priceRange')}
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            label={t('products:filters.minPrice')}
            value={draft.price_min}
            onChange={(event) => update({ price_min: event.target.value })}
            placeholder="0"
          />
          <Input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            label={t('products:filters.maxPrice')}
            value={draft.price_max}
            onChange={(event) => update({ price_max: event.target.value })}
            placeholder="0"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-base-dark">
          {t('products:filters.availability')}
        </legend>
        <label className="flex items-center gap-3 text-sm text-base-dark">
          <input
            type="checkbox"
            className={checkboxClass}
            checked={draft.availability}
            onChange={(event) => update({ availability: event.target.checked })}
          />
          {t('products:filters.availableOnly')}
        </label>
        <label className="flex items-center gap-3 text-sm text-base-dark">
          <input
            type="checkbox"
            className={checkboxClass}
            checked={draft.onOffer}
            onChange={(event) => update({ onOffer: event.target.checked })}
          />
          {t('products:filters.onOffer')}
        </label>
      </fieldset>

      <div className="mt-1 flex flex-col gap-2 pt-2">
        <Button type="submit" size="md" className="w-full">
          {t('products:filters.button')}
        </Button>
        <Button type="button" variant="subtle" size="md" className="w-full" onClick={handleReset}>
          {t('products:filters.reset')}
        </Button>
      </div>
    </form>
  );
}
