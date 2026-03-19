"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const HeaderMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

type HeaderMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const HeaderMenu = ({ regions, locales, currentLocale }: HeaderMenuProps) => {
  return (
    <div className="h-full">
      <div className="flex items-center h-full gap-x-2 md:gap-x-4">
        <Popover className="h-full flex relative md:hidden">
          {({ open, close }) => (
            <>
              <Popover.Button
                data-testid="nav-menu-button"
                className="relative h-full px-3 flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base text-sm"
              >
                Menu
              </Popover.Button>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="header-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
              >
                <PopoverPanel className="absolute top-full mt-2 right-0 w-48 z-[51] text-sm text-ui-fg-base shadow-lg rounded-lg bg-white border border-ui-border-base">
                  <div
                    data-testid="header-menu-popup"
                    className="flex flex-col py-4"
                  >
                    <ul className="flex flex-col items-start justify-start">
                      {Object.entries(HeaderMenuItems).map(([name, href]) => {
                        return (
                          <li key={name} className="w-full">
                            <LocalizedClientLink
                              href={href}
                              className="px-4 py-2 hover:bg-ui-bg-subtle hover:text-ui-fg-base transition-colors block w-full"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="border-t border-ui-border-base mt-4 pt-4 px-4 flex flex-col gap-y-4">
                      {!!locales?.length && (
                        <div>
                          <LanguageSelect
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                        </div>
                      )}
                      {regions && (
                        <div>
                          <CountrySelect
                            regions={regions}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>

        <div className="hidden md:flex items-center gap-x-2">
          {regions && (
            <CountrySelect
              regions={regions}
            />
          )}
          {locales?.length && (
            <LanguageSelect
              locales={locales}
              currentLocale={currentLocale}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderMenu
