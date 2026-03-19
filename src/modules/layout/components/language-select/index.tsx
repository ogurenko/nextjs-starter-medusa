"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"
import { ChevronDownMini } from "@medusajs/icons"

import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"

type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) {
      return locale.region.toUpperCase()
    }
    const maximized = locale.maximize()
    return maximized.region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

type LanguageSelectProps = {
  locales: Locale[]
  currentLocale: string | null
}

/**
 * Gets the localized display name for a language code using Intl API.
 * Falls back to the provided name if Intl is unavailable.
 */
const getLocalizedLanguageName = (
  code: string,
  fallbackName: string,
  displayLocale: string = "en-US"
): string => {
  try {
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "language",
    })
    return displayNames.of(code) ?? fallbackName
  } catch {
    return fallbackName
  }
}

const DEFAULT_OPTION: LanguageOption = {
  code: "",
  name: "Default",
  localizedName: "Default",
  countryCode: "",
}

const LanguageSelect = ({
  locales,
  currentLocale,
}: LanguageSelectProps) => {
  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const options = useMemo(() => {
    const localeOptions = locales.map((locale) => ({
      code: locale.code,
      name: locale.name,
      localizedName: getLocalizedLanguageName(
        locale.code,
        locale.name,
        currentLocale ?? "en-US"
      ),
      countryCode: getCountryCodeFromLocale(locale.code),
    }))
    return [DEFAULT_OPTION, ...localeOptions]
  }, [locales, currentLocale])

  useEffect(() => {
    if (currentLocale) {
      const option = options.find(
        (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
      )
      setCurrent(option ?? DEFAULT_OPTION)
    } else {
      setCurrent(DEFAULT_OPTION)
    }
  }, [options, currentLocale])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      setIsOpen(false)
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <Listbox
        as="div"
        onChange={handleChange}
        value={current}
        disabled={isPending}
      >
        <ListboxButton className="py-2 px-3 flex items-center gap-x-2 hover:bg-ui-bg-base rounded-md transition-colors">
          <div className="txt-compact-small flex items-center gap-x-2 cursor-pointer">
            <span className="hidden sm:inline text-ui-fg-subtle">Language:</span>
            {current && (
              <span className="flex items-center gap-x-2">
                {current.countryCode && (
                  /* @ts-ignore */
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={current.countryCode}
                  />
                )}
                <span className="text-ui-fg-base">
                  {isPending ? "..." : current.localizedName}
                </span>
              </span>
            )}
            <ChevronDownMini className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </ListboxButton>

        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          beforeEnter={() => setIsOpen(true)}
          beforeLeave={() => setIsOpen(false)}
        >
          <ListboxOptions
            className="absolute top-full mt-2 right-0 w-56 z-[900] bg-white border border-ui-border-base shadow-lg rounded-lg overflow-hidden"
            static
          >
            <div className="max-h-[400px] overflow-y-auto">
              {options.map((o) => (
                <ListboxOption
                  key={o.code || "default"}
                  value={o}
                  className="py-2 px-3 hover:bg-ui-bg-base cursor-pointer flex items-center gap-x-2 transition-colors text-ui-fg-base text-small-regular"
                >
                  {o.countryCode ? (
                    /* @ts-ignore */
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o.countryCode}
                    />
                  ) : (
                    <span style={{ width: "16px", height: "16px" }} />
                  )}
                  <span>{o.localizedName}</span>
                </ListboxOption>
              ))}
            </div>
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  )
}

export default LanguageSelect
