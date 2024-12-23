import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TextInput, NumberInput, Button } from '@tremor/react';

export default function AddStockModal({ open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Add Stock to Watchlist
                    </Dialog.Title>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                          Stock Symbol
                        </label>
                        <TextInput
                          id="symbol"
                          placeholder="Enter stock symbol (e.g., AAPL)"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="alertPrice" className="block text-sm font-medium text-gray-700">
                          Alert Price
                        </label>
                        <NumberInput
                          id="alertPrice"
                          placeholder="Enter alert price"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    Add to Watchlist
                  </Button>
                  <Button
                    variant="secondary"
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 