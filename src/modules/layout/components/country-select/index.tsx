"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { ChevronDownMini } from "@medusajs/icons"

import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<
    | { country: string | undefined; region: string; label: string | undefined }
    | undefined
  >(undefined)
  const [isOpen, setIsOpen] = useState(false)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Listbox
        as="div"
        onChange={handleChange}
        value={current}
      >
        <ListboxButton className="py-2 px-3 flex items-center gap-x-2 hover:bg-ui-bg-base rounded-md transition-colors">
          <div className="txt-compact-small flex items-center gap-x-2 cursor-pointer">
            <span className="hidden sm:inline text-ui-fg-subtle">Region:</span>
            {current && (
              <span className="flex items-center gap-x-2">
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country ?? ""}
                />
                <span className="text-ui-fg-base">{current.label}</span>
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
              {options?.map((o, index) => {
                return (
                  <ListboxOption
                    key={index}
                    value={o}
                    className="py-2 px-3 hover:bg-ui-bg-base cursor-pointer flex items-center gap-x-2 transition-colors text-ui-fg-base text-small-regular"
                  >
                    {/* @ts-ignore */}
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o?.country ?? ""}
                    />
                    <span>{o?.label}</span>
                  </ListboxOption>
                )
              })}
            </div>
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  )
}

export default CountrySelect
